import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import find_peaks, peak_widths, boxcar
from astropy.convolution import convolve as astropy_convolve
from scipy.stats import mode
from statsmodels.robust import mad

import muldoon.utils as utils

__all__ = ['MetTimeseries']


class MetTimeseries(object):
    """
    Process and analyze a meteorological time-series to search for vortices
    """

    def __init__(self, time, pressure, windspeed=None, wind_direction=None):
        """
        Args:
            time (float, array): time of meteorological time-series
            pressure (float, array): pressure measurements
            windspeed (float, array, optional): wind speed measurements
            wind_direction (float, array, optional): wind velocity aziumth
        """

        self.time = time
        # Calculate the sampling rate
        self.sampling = mode(time[1:] - time[0:-1]).mode[0]

        self.pressure = pressure

        if(windspeed is not None):
            self.windspeed = windspeed

        if(wind_direction is not None):
            self.wind_direction = wind_direction

        # Filtered pressure time-series
        self.detrended_pressure = None

        self.detrended_pressure_scatter = None

        # Time-series filters
        self.pressure_trend = None

        # convolution of matched filter
        self.convolution = None

        self.peak_indices = None
        self.peak_widths = None

        # Collection of time-series for individual vortices
        self.vortices = None

        self.popts = None
        self.uncs = None

    def detrend_pressure_timeseries(self, window_width, 
            deal_with_gaps=True):
        """
        Applies boxcar filter to pressure time-series

        Args:
            window_width (float): width of window in the same units as time
            deal_with_gaps (bool, optional): whether to check for gaps

        Returns:
            detrended pressure time-series (float array)

        """

        # Queue up to deal with gaps
        local_time = [self.time]
        local_pressure = [self.pressure]

        if(deal_with_gaps):
            local_time, local_pressure = utils.break_at_gaps(self.time,
                    self.pressure)
            
        # Calculate number of points for window_width
        window_size = int(window_width/self.sampling)
        # Check that window_size is odd
        if(window_size % 2 == 0): 
            window_size += 1

        self.window_size = window_size

        # Empty out the Nones
        self.detrended_pressure = np.array([])

        # Detrend, piece at a time
        for i in range(len(local_time)):

            local_pressure_trend = astropy_convolve(local_pressure[i],
                    boxcar(window_size), boundary='extend', 
                    preserve_nan=True)
            self.pressure_trend = np.append(self.pressure_trend,
                    local_pressure_trend)

            self.detrended_pressure =\
                    np.append(self.detrended_pressure, 
                            local_pressure[i] - local_pressure_trend)

        self.detrended_pressure_scatter = np.nanstd(self.detrended_pressure)

        return self.detrended_pressure

    def write_out_detrended_timeseries(self, filename="out.csv", mode="w",
            test_mode=False):
        """
        Write out formatted text file of detrended time-series

        Args:
            filename (str, optional): path of file to which to write out data
            mode (str, optional): write mode; defaults to over-write
            test_mode (bool, optional): whether to actually write out file

        """

        if(self.detrended_pressure is None):
            raise ValueError("Need to detrend pressure!")

        # Construct write string
        write_str = "# time, pressure\n"

        for i in range(len(self.time) - 1):
            write_str += "%g, %g\n" %\
                    (self.time[i], self.detrended_pressure[i])

        # Don't write a new-line character for the last entry
        write_str += "%g, %g" % (self.time[-1], self.detrended_pressure[-1])
            
        if(~test_mode):
            f = open(filename, mode)
            f.write(write_str)
            f.close()

        return write_str

    def apply_lorentzian_matched_filter(self, lorentzian_fwhm,
            lorentzian_depth, num_fwhms=6.):
        """
        Applies Lorentzian matched filter to detrended pressure to find
        vortices

        Args:
            lorentzian_fwhm (float): the full-width/half-max of the matched
            filter
            lorentzian_depth (float): the depth of the filter; probably wants
            to be 1./np.pi
            num_fwhms (float, optional): how many full-width/half-maxes to
            generate matched filter; defaults to 6

        Returns:
            Results from matched filter (float array)

        """

        if(self.detrended_pressure_scatter is None):
            raise ValueError("Run detrend_pressure_timeseries first!")

        lorentzian_time = np.arange(-num_fwhms/2*lorentzian_fwhm, 
                num_fwhms/2.*lorentzian_fwhm, self.sampling)
        lorentzian = utils.modified_lorentzian(lorentzian_time, 0., 0., 0., 
                lorentzian_depth, lorentzian_fwhm)

        # Make sure the matched filter isn't wider than the signal itself
        if(len(lorentzian_time) > len(self.time)):
            raise ValueError("lorentzian_time is wider than detrended "+\
                    "pressure!")

        convolution =\
            np.convolve(self.detrended_pressure/\
            self.detrended_pressure_scatter, 
                    lorentzian, mode='same')

        # Shift and normalize
        med = np.nanmedian(convolution)
        md = mad(convolution)
        self.convolution = (convolution - med)/md

        return self.convolution

    def find_vortices(self, detection_threshold=5, distance=20, fwhm_factor=6):
        """
        Finds distinct peaks in the matched-filter convolution, presumably
        vortex signals

        Args: 
            detection_threshold (float, optional): threshold for peak detection
            distance (int, optional): min number of point between peaks
            fwhm_factor (int, optional): when returning vortices, how wide a time window to return

        Returns:
            list of times and pressures for each vortex

        """

        if(self.convolution is None):
            raise ValueError("Run apply_lorentzian_matched_filter first!")

        ex = find_peaks(self.convolution, distance=distance)
        ind = self.convolution[ex[0]] >= detection_threshold

        pk_wds, _, _, _ = peak_widths(self.convolution, ex[0][ind])

        # Sort from largest peak to smallest
        srt_ind = np.argsort(self.convolution[ex[0][ind]])[::-1]
        self.peak_indices = ex[0][ind][srt_ind]
        self.peak_widths = pk_wds[srt_ind]

        self.vortices = []
        for i in range(len(self.peak_indices)):
            mn_ind = int(self.peak_indices[i] -\
                    fwhm_factor/2*int(self.peak_widths[i]))
            mx_ind = int(self.peak_indices[i] +\
                    fwhm_factor/2*int(self.peak_widths[i]))

            # Make sure there are enough points in the vortex
            if(mx_ind - mn_ind > 5):
                # Use original, unfiltered data
                self.vortices.append({"time": self.time[mn_ind:mx_ind],
                    "pressure": self.pressure[mn_ind:mx_ind],
                    "pressure_scatter": self.detrended_pressure_scatter*\
                            np.ones_like(self.time[mn_ind:mx_ind])})

        return self.vortices

    def fit_all_vortices(self, use_sigma=True):
        """
        Fit all vortices with modified Lorentzian and return fit parameters and
        uncertainties

        Args:
            use_sigma (bool, optional): whether to send detrended pressure scatter to curve_fit


        Returns:
            list of two arrays, the first with best fit parameters and the
            second with uncertainties

        """

        if(self.vortices is None):
            raise ValueError("Run find_vortices first!")
        if(len(self.vortices) == 0):
            raise ValueError("There are no vortices!")

        self.popts = list()
        self.uncs = list()
        for i in range(len(self.vortices)):
            # Estimate initial parameters
            init_params = self._determine_init_params(self.vortices[i])

            # Estimate bounds
            bounds = self._determine_bounds(self.vortices[i], init_params)

            if(use_sigma):
                popt, unc = utils.fit_vortex(self.vortices[i], init_params, 
                        bounds, sigma=self.vortices[i]["pressure_scatter"])
            else:
                popt, unc = utils.fit_vortex(self.vortices[i], init_params, 
                        bounds)

            self.popts.append(popt)
            self.uncs.append(unc)

        return self.popts, self.uncs

    def _determine_init_params(self, vortex, 
            init_baseline=None, init_slope=None, init_t0=None, 
            init_DeltaP=None, init_Gamma=None):
        """
        Estimate reasonable initial parameters for fitting a vortex pressure
        signal

        Args:
            vortex (dict of float arrays): vortex["time"] - time, 
            vortex["pressure"] - pressure
            init_* (float): initial parameters

        Returns:
            float array of initial parameter values

        """

        x = vortex["time"]
        y = vortex["pressure"]

        # Initial fit to background trend
        fit_params = np.polyfit(x, y, 1)
        detrended_y = y - np.polyval(fit_params, x)

        if(init_baseline is None):
            init_baseline = np.median(y)

        if(init_slope is None):
            init_slope = (y[-1] - y[0])/(x[-1] - x[0])

        if(init_t0 is None):
            init_t0 = x[np.argmin(detrended_y)]

        if(init_DeltaP is None):
            init_DeltaP = np.max(detrended_y) - np.min(detrended_y) 

        if(init_Gamma is None):
            init_Gamma = 5.*self.sampling

        return np.array([init_baseline, init_slope, init_t0, init_DeltaP, 
            init_Gamma])

    def _determine_bounds(self, vortex, init_params,
            slope_fac=10., Gamma_fac=10.):
        """
        Estimate reasonable bounds on fit parameters

        Args:
            vortex (dict of float arrays): vortex["time"] - time,
            vortex["pressure"] - pressure
            init_params (float array): initial parameters in following order:
                init_baseline, init_slope, init_t0, init_DeltaP, init_Gamma
            slope_fac (float): maximum factor for slope upper bound
            Gamma_fac (float): maximum factor for Gamma upper bound
    
        Returns:
            float array with lower and upper bounds on fit parameters

        """

        x = vortex["time"]
        y = vortex["pressure"]

       # Initial fit to background trend
        fit_params = np.polyfit(x, y, 1)
        detrended_y = y - np.polyval(fit_params, x)

        # Baseline probably doesn't exceed minimum or maximum y
        mn_baseline = np.min(y)
        mx_baseline = np.max(y)

        # Slope unlikely to exceed overall slope
        overall_slope = (y[-1] - y[0])/(x[-1] - x[0])
        mn_slope = -slope_fac*np.abs(overall_slope)
        mx_slope = slope_fac*np.abs(overall_slope)

        mn_t0 = np.min(x)
        mx_t0 = np.max(x)

        # Can't have negative delta P's
        mn_deltaP = 0.
        mx_deltaP = np.max(detrended_y) - np.min(detrended_y)

        mn_Gamma = 2.*self.sampling # Nyquist sampling
        mx_Gamma = np.min([Gamma_fac*init_params[4], x[-1] - x[0]])

        return ([mn_baseline, mn_slope, mn_t0, mn_deltaP, mn_Gamma],
                [mx_baseline, mx_slope, mx_t0, mx_deltaP, mx_Gamma])

    def make_conditioned_data_figure(self, which_vortex=0, 
            fig=None, figsize=(10, 10), aspect_ratio=16./9,
            pressure_units="Pa", time_units="Hours", vortex_time_units="s",
            write_filename=None):
        """
        Make figure showing the data conditioning and analysis process -
        like Figure 1 of Jackson et al. (2021)

        Args:
            which_vortex (int): which vortex within vortices to plot
            fig (matplotlib figure obj, optional): the figure object to use
            figsize (2x1 list, optional): inches x inches figure size
            aspect_ratio (float, optional): figure aspect ratio
            pressure/time/vortex_time_units (str, optional): units to label axes
            write_filename (str, optional): filename stem to use for writing out

        Returns:
            figure and all axes

        """

        # Boise State official colors in hex
        # boisestate.edu/communicationsandmarketing/brand-standards/colors/
        BoiseState_blue = "#0033A0"
        BoiseState_orange = "#D64309"

        if(self.peak_indices is None):
            raise ValueError("Run find_vortices first!")
        if(self.popts is None):
            raise ValueError("Run fit_all_vortices first!")

        if(fig is None):
            fig = plt.figure(figsize=(figsize[0]*aspect_ratio, figsize[1]))

        # Add axes
        ax1 = fig.add_subplot(221)
        ax2 = fig.add_subplot(223, sharex=ax1)
        ax3 = fig.add_subplot(222)
        ax4 = fig.add_subplot(224)

        ### Raw data ###
        ax1.plot(self.time, self.pressure, 
                marker='.', ls='', color=BoiseState_blue)
        ax1.text(0.05, 0.8, "(a)", fontsize=48, transform=ax1.transAxes)
        ax1.grid(True)
        ax1.tick_params(labelsize=24, labelbottom=False)
        ax1.set_ylabel(r'$P\,\left({\rm %s}\right)$' % (pressure_units), 
                fontsize=36)

        if(write_filename is not None):
            filename = write_filename + "panel_a.csv"
            utils.write_out_plot_data(self.time, self.pressure, 
                    "Time", "Pressure", filename=filename)

        ### Filtered data ###
        ax2.plot(self.time, self.detrended_pressure, 
                marker='.', ls='', color=BoiseState_blue)
        ax2.text(0.05, 0.05, "(b)", fontsize=48, transform=ax2.transAxes)
        ax2.grid(True)
        ax2.tick_params(labelsize=24)
        ax2.set_xlabel("Time (%s)" % (time_units), fontsize=36)
        ax2.set_ylabel(r'$\Delta P\,\left( {\rm %s} \right)$' %\
                (pressure_units), fontsize=36)

        if(write_filename is not None):
            filename = write_filename + "panel_b.csv"
            utils.write_out_plot_data(self.time, self.detrended_pressure,
                    "Time", "Detrended_Pressure", filename=filename)


        ### Convolution ###
        ax3.plot(self.time, self.convolution, 
                color=BoiseState_blue, ls='', marker='.')
        ax3.text(0.05, 0.8, "(c)", fontsize=48, transform=ax3.transAxes)
        ax3.grid(True)
        ax3.yaxis.set_label_position("right")
        ax3.yaxis.tick_right()
        ax3.tick_params(labelsize=24, labelleft=False, labelright=True)
        ax3.set_ylabel(r'$\left( F \ast \Delta P \right)$', fontsize=36)

        if(write_filename is not None):
            filename = write_filename + "panel_c.csv"
            utils.write_out_plot_data(self.time, self.convolution,
                    "Time", "Convolution", filename=filename)


        # Add lines in all plots highlighting the detections
        for cur_ex in self.peak_indices:
            ax1.axvline(self.time[cur_ex], 
                    color=BoiseState_orange, zorder=-1, ls='--', lw=3)
            ax2.axvline(self.time[cur_ex], 
                    color=BoiseState_orange, zorder=-1, ls='--', lw=3)
            ax3.axvline(self.time[cur_ex], 
                    color=BoiseState_orange, zorder=-1, ls='--', lw=3)


        ### Fit vortex ###
        vortex_model =\
                utils.modified_lorentzian(self.vortices[which_vortex]["time"], 
                        *self.popts[which_vortex]) -\
                self.popts[which_vortex][0]

        # Remember! Times are in hours!
        x = (self.vortices[which_vortex]["time"] -
                self.popts[which_vortex][2])*3600.
        ydata = self.vortices[which_vortex]["pressure"] -\
                self.popts[which_vortex][0]
        yerr = self.vortices[which_vortex]["pressure_scatter"]
        # Plot data with error bars
        ax4.errorbar(x, ydata, yerr=yerr,
                ls='', marker='o', color=BoiseState_blue)
        # Plot model fit
        ax4.plot(x, vortex_model, lw=3, color=BoiseState_orange, zorder=-1)

        ax4.text(0.05, 0.05, "(d)", fontsize=48, transform=ax4.transAxes)
        ax4.grid(True)
        ax4.yaxis.set_label_position("right")
        ax4.yaxis.tick_right()
        ax4.tick_params(labelsize=24, labelleft=False, labelright=True)

        ax4.set_xlabel(r'$t - t_0\,\left( {\rm %s} \right)$' %\
                (vortex_time_units), fontsize=36)
        ax4.set_ylabel(r'$\Delta P\,\left( {\rm %s} \right)$' %\
                (pressure_units), fontsize=36)

        if(write_filename is not None):
            filename = write_filename + "panel_d_data.csv"
            utils.write_out_plot_data(x, ydata, "Time", "DeltaP", 
                    yerr=yerr, filename=filename)

            filename = write_filename + "panel_d_model.csv"
            utils.write_out_plot_data(x, vortex_model, "Time", "DeltaP", 
                    filename=filename)

        return fig, ax1, ax2, ax3, ax4

