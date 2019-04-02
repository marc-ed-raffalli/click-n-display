# Click n' Display

Minimalistic App written in vanilla JS to display a set of arbitrary data after a click on a picture coordinates.

## Data

The data is stored in `data.json`:

```json
{
  "title": "App title",
  "imageUrl": "url of the picture",
  "items": [
      {
        "pos": {
          "x": 72,
          "y": 51
        },
        "styles": {
          
        },
        "data": {
          
        }
      }
  ]
}
```

Each item is positioned absolutely at `pos` on top of the picture located at `imageUrl` with the `styles` provided.

### Positioning items

`pos` refers to the coordinates in pct (top left based).

Clicking on the image prints out on the console the computed `pos` at the location of the click.

```text
Click on img: {x: 48, y: 29}
```

### Items' styles

The styles are directly applied to the element placed on the picture:

```json
{
  "styles": {
    "background-image": "url('https://placekitten.com/50/50')",
    "border-radius": "50%",
    "width": "50px",
    "height": "50px"
  }
}
```

### Items' data

The data stored in the item `data` is rendered on the right column / bottom row for responsive.
String, number and nested array / object are supported without limitations.

## License

This project is licensed under the MIT license.
See the [LICENSE](https://github.com/marc-ed-raffalli/click-n-display/blob/master/LICENSE) file for more info.
