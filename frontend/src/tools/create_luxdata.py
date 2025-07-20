import requests
import json

def fetch_all_observations():
    base_url = "https://gi3.gis.lrg.tum.de/frost/v1.1/Datastreams(1503)/Observations"
    params = {
        "$filter": "phenomenonTime ge 2025-07-18T19:40:00Z and phenomenonTime le 2025-07-18T23:59:59Z"
    }

    all_data = []
    url = base_url
    while url:
        response = requests.get(url, params=params if url == base_url else None)
        if response.status_code != 200:
            print(f"Failed to fetch data: {response.status_code}")
            break
        
        data = response.json()
        all_data.extend(data.get("value", []))
        url = data.get("@iot.nextLink", None)

    return all_data

def save_to_json(data, filename="gps_datastream.json"):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# Run the script
if __name__ == "__main__":
    observations = fetch_all_observations()
    save_to_json(observations)
    print(f"Saved {len(observations)} observations to lux_data.json")
