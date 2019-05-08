import inspect
import os
import sys
import unittest

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
    parent_dir = os.path.dirname(current_dir)
    sys.path.insert(0, parent_dir)

    from tests.test_parquet import ParquetTests
    from tests.test_log import XesTests

    tp = ParquetTests()
    tx = XesTests()

    unittest.main()
