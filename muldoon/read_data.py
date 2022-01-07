"""
A collections of routines to read in data from various missions
"""

import numpy as np
import pandas as pd

def read_Perseverance_PS_data(filename, sol=None):
    """
    Read in Perseverance MEDA PS data - https://pds-atmospheres.nmsu.edu/PDS/data/PDS4/Mars2020/mars2020_meda/

    Args:
        filename (str): path to CSV file

    Returns:
        time, pressure (float array): times and pressures, times in seconds
        since midnight of sol associated with filename
    """

    time = make_seconds_since_midnight(filename)
    pressure = pd.read_csv(filename)['PRESSURE'].values

    return time, pressure

def read_Perseverance_ATS_data(filename, which_ATS=1, sol=None):
    """
    Read in Perseverance MEDA ATS data - https://pds-atmospheres.nmsu.edu/PDS/data/PDS4/Mars2020/mars2020_meda/

    Args:
        filename (str): path to CSV file
        which_ATS (int): which of the five ATS sensors to read in

    Returns:
        time, pressure (float array): times and pressures, times in seconds
        since midnight of sol associated with filename

    """

    time = make_seconds_since_midnight(filename)

    # Which ATS time-series to read in?
    which_ATS_str = "ATS_LOCAL_TEMP%i" % which_ATS
    temperature = pd.read_csv(filename)[which_ATS_str].values

    return time, temperature

def make_seconds_since_midnight(filename, sol=None):
    """
    The MEDA data provide times in the LTST field in the format "sol hour:minute:second".

    Args:
        filename (str): name of the file

    Returns:
        number of seconds in each row since midnight of the primary sol for that file
        """

    if(sol is None):
        primary_sol = which_sol(filename)
    data = pd.read_csv(filename)

    # Grab the sols and times associated with each row
    sols_str = data['LTST'].str.split(expand=True)[0].values
    times_str = data['LTST'].str.split(expand=True)[1].values

    # Turn the times strings into seconds since midnight of the primary sol
    delta_sols = sols_str.astype(float) - float(primary_sol)

    # And then in a very cludgey way, convert times to seconds since primary sol's midnight
    time = np.array([float(times_str[i].split(":")[0]) + delta_sols[i]*24.  +\
            float(times_str[i].split(":")[1])/60 +\
            float(times_str[i].split(":")[2])/3600. for i in
            range(len(times_str))])

    return time

def which_sol(filename):
    """
    Based on the filename, returns the sol corresponding to a data file

    Args:
        filename (str): name of the file

    Returns:
        sol (int) associated with that file
    """

    ind = filename.find("WE__")

    return int(filename[ind+4:ind+8])
