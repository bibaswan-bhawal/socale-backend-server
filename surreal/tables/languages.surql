DEFINE TABLE languages SCHEMAFULL;

DEFINE FIELD name on TABLE languages TYPE string;

DEFINE INDEX name on TABLE languages COLUMNS name UNIQUE;