DEFINE TABLE majors SCHEMAFULL;

DEFINE FIELD name on TABLE majors TYPE string;
DEFINE FIELD department on TABLE majors TYPE string;
DEFINE FIELD tags ON TABLE majors TYPE array;

DEFINE INDEX name on TABLE majors COLUMNS name UNIQUE;