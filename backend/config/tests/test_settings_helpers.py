from pathlib import Path
from unittest.mock import patch

from django.test import SimpleTestCase

from config.settings_helpers import build_database_config, get_bool_env, get_csv_env


class SettingsHelpersTests(SimpleTestCase):
    def test_get_bool_env_reads_common_true_false_values(self):
        with patch.dict("os.environ", {"FEATURE_ON": "true", "FEATURE_OFF": "0"}):
            self.assertTrue(get_bool_env("FEATURE_ON", default=False))
            self.assertFalse(get_bool_env("FEATURE_OFF", default=True))

    def test_get_csv_env_strips_empty_values(self):
        with patch.dict("os.environ", {"HOSTS": " example.com, api.example.com, ,"}):
            self.assertEqual(get_csv_env("HOSTS"), ["example.com", "api.example.com"])

    def test_build_database_config_uses_sqlite_without_database_url(self):
        base_dir = Path("/app/backend")

        with patch.dict("os.environ", {}, clear=True):
            database = build_database_config(base_dir)

        self.assertEqual(database["ENGINE"], "django.db.backends.sqlite3")
        self.assertEqual(database["NAME"], base_dir / "db.sqlite3")

    def test_build_database_config_uses_database_url_when_present(self):
        database_url = "postgres://stayfinder:secret@db.example.com:5432/stayfinder"

        with patch.dict("os.environ", {"DATABASE_URL": database_url}):
            database = build_database_config(Path("/app/backend"))

        self.assertEqual(database["ENGINE"], "django.db.backends.postgresql")
        self.assertEqual(database["NAME"], "stayfinder")
        self.assertEqual(database["HOST"], "db.example.com")
