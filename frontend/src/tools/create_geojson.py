import json
from datetime import datetime, timedelta

# Load lux data
with open("lux_data.json", "r", encoding="utf-8") as f:
    lux_data = json.load(f)

# Load GPS data
with open("gps_datastream.json", "r", encoding="utf-8") as f:
    gps_data = json.load(f)

# Convert GPS data into time-indexed dictionary
gps_by_time = {}
for obs in gps_data:
    try:
        timestamp = datetime.fromisoformat(obs["phenomenonTime"].replace("Z", "+00:00"))
        gps_by_time[timestamp] = obs["result"]
    except Exception as e:
        print(f"Skipping invalid GPS observation: {e}")

# Create GeoJSON features
features = []
for lux_obs in lux_data:
    try:
        lux_time = datetime.fromisoformat(lux_obs["phenomenonTime"].replace("Z", "+00:00"))
        lux_value = lux_obs["result"]

        # Find closest GPS timestamp within ±1 second
        closest_time = None
        min_diff = timedelta(seconds=1)
        for gps_time in gps_by_time:
            diff = abs(lux_time - gps_time)
            if diff <= min_diff:
                min_diff = diff
                closest_time = gps_time

        if closest_time:
            coords = gps_by_time[closest_time]
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [coords["longitude"], coords["latitude"]]
                },
                "properties": {
                    "timestamp": lux_obs["phenomenonTime"],
                    "lux": lux_value
                }
            }
            features.append(feature)
        else:
            print(f"No GPS match for lux timestamp: {lux_obs['phenomenonTime']}")

    except Exception as e:
        print(f"Skipping invalid lux observation: {e}")

# Output GeoJSON FeatureCollection
geojson = {
    "type": "FeatureCollection",
    "features": features
}

# Save to file
with open("combined_lux_gps.geojson", "w", encoding="utf-8") as f:
    json.dump(geojson, f, indent=2)

print(f"GeoJSON saved with {len(features)} features.")
