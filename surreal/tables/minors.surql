DEFINE TABLE minors SCHEMAFULL;

DEFINE FIELD name on TABLE minors TYPE string;
DEFINE FIELD department on TABLE minors TYPE string;
DEFINE FIELD tags ON TABLE minors TYPE array;

DEFINE INDEX name on TABLE minors COLUMNS name UNIQUE;

