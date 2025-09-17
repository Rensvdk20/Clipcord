# Contributing to Clipcord

Thanks for helping improve Clipcord! Here’s how to add a new image pack

### Creating a New Pack
1. Fork the repository
2. Create a new JSON file in `src/assets/packs/` with a descriptive name (e.g., `cats.json`, `animal_crossing.json`)
3. Follow the pack format:
    ```json
    [
      {
        "src": "<img url here>",
        "keywords": ["keyword", "other_keyword"]
      },
      {
        "src": "<img url here>",
        "keywords": ["keyword"]
      }
    ]
    ```
4. Ensure all image URLs are publicly accessible
5. Add relevant keywords to make images searchable
6. Submit a pull request
