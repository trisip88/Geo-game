export const RGOGC_JSON_SCHEMA = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "RGOGC Match Record Schema",
  "description": "JSON Schema specification for Random Geography Open-data Guessing Challenge match records and round telemetry.",
  "type": "object",
  "required": [
    "game",
    "version",
    "generated_at",
    "data_sources",
    "live_feed",
    "scoring",
    "rounds_played",
    "rounds",
    "totals",
    "status"
  ],
  "properties": {
    "game": {
      "type": "string",
      "enum": ["RGOGC"],
      "description": "Identifier for the game"
    },
    "version": {
      "type": "string",
      "description": "Game engine and schema specification version"
    },
    "generated_at": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp when the record was generated"
    },
    "data_sources": {
      "type": "array",
      "items": { "type": "string" },
      "description": "List of keyless open APIs and datasets used during this session"
    },
    "live_feed": {
      "type": "string",
      "enum": ["online", "bundled", "probing", "error"],
      "description": "Status of external open API connectivity"
    },
    "scoring": {
      "type": "object",
      "required": ["formula", "bullseye_radius_km", "max_per_round"],
      "properties": {
        "formula": {
          "type": "string",
          "example": "5000 * exp(-distance_km / 1500)"
        },
        "bullseye_radius_km": {
          "type": "number",
          "minimum": 0,
          "example": 25
        },
        "max_per_round": {
          "type": "integer",
          "minimum": 0,
          "example": 5000
        }
      }
    },
    "rounds_played": {
      "type": "integer",
      "minimum": 0,
      "description": "Number of completed rounds in the current match"
    },
    "total_rounds": {
      "type": "integer",
      "minimum": 1,
      "example": 5
    },
    "rounds": {
      "type": "array",
      "description": "List of completed round telemetry and guess outcomes",
      "items": {
        "type": "object",
        "required": [
          "round",
          "place",
          "guess",
          "distance_km",
          "points",
          "seconds"
        ],
        "properties": {
          "round": {
            "type": "integer",
            "minimum": 1
          },
          "place": {
            "type": "object",
            "required": ["name", "country", "lat", "lon"],
            "properties": {
              "name": { "type": "string" },
              "country": { "type": "string" },
              "lat": { "type": "number", "minimum": -90, "maximum": 90 },
              "lon": { "type": "number", "minimum": -180, "maximum": 180 },
              "wikipediaTitle": { "type": "string" }
            }
          },
          "guess": {
            "type": "object",
            "required": ["lat", "lon"],
            "properties": {
              "lat": { "type": "number", "minimum": -90, "maximum": 90 },
              "lon": { "type": "number", "minimum": -180, "maximum": 180 }
            }
          },
          "distance_km": {
            "type": "number",
            "minimum": 0,
            "description": "Haversine great-circle distance between guess and target"
          },
          "points": {
            "type": "integer",
            "minimum": 0,
            "maximum": 5000,
            "description": "Exponential score earned for the round"
          },
          "seconds": {
            "type": "number",
            "minimum": 0,
            "description": "Time elapsed in seconds before lock-in"
          },
          "cluesRevealedCount": {
            "type": "integer",
            "minimum": 1,
            "maximum": 3
          },
          "usedLiveFeed": {
            "type": "boolean"
          }
        }
      }
    },
    "totals": {
      "type": "object",
      "required": ["score", "max_possible", "accuracy_pct", "avg_error_km"],
      "properties": {
        "score": {
          "type": "integer",
          "minimum": 0
        },
        "max_possible": {
          "type": "integer",
          "minimum": 0
        },
        "accuracy_pct": {
          "type": "number",
          "minimum": 0,
          "maximum": 100
        },
        "avg_error_km": {
          "type": "number",
          "minimum": 0
        }
      }
    },
    "status": {
      "type": "string",
      "enum": ["in_progress", "complete"]
    }
  }
};
