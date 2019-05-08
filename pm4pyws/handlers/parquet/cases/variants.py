from pm4py.statistics.traces.pandas import case_statistics


def get_statistics(df, parameters=None):
    """
    Gets the variants from the dataframe

    Parameters
    ------------
    df
        Dataframe
    parameters
        Possible parameters of the algorithm

    Returns
    ------------
    variants
        Variants of the event log
    """
    if parameters is None:
        parameters = {}

    variants_statistics = case_statistics.get_variant_statistics(df)

    return variants_statistics
