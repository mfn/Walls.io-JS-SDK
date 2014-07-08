WallStream
===============

Widgets and tools for Walls.io

## Usage

There are two levels of WallStream:
1. The WallStream plugins for high-level access: **[WallStream Widget](#javascript-widget)** and **[WallStream jQuery](jquery-plugin)**.
2. The `WallStreamCore` class for low-level access.

Both levels share the same set of base parameters:
- `accessToken`: Your wall access token (required)
- `initialLimit`: The number of posts that are fetched after initialization (optional, default: `10`)
- `interval`: How often to check for new posts, in milliseconds (optional, default: `5000`, minimum: `1000`)
- `fields`: An array of field names you want to receive for each post (optinal, default: all fields)
- `types`: An array of post types (e.g. `["twitter", "facebook"]`) that you want to receive posts for (optional, default: all types)


The plugins (both jQuery and JS widget) have several additional options:
- `template`: A JST template that is used for rendering the post. All fields the API returns for a post are accessible in your template. You can insert variable values with `<%=variableName%>` and even use arbitrary JavaScript (see example below)
- `maxPosts`: The maximum number of posts that can be in the widget at one time (optional, default: `10`, pass `false` for unlimited posts)
- `insertPosition`: The position where new posts are added to the DOM (possible values: `before` and `after`, default: `before`)
- `beforeInsert`: A function that is passed the HTML of the rendered post, as well as the post object itself. Use this if you want to modify the post HTML before it is inserted into the DOM. You need to return the modified (or unchanged) HTML from this callback function. You can discard a post by returning `false` from this function.
- `afterInsert`: This event fires after a post has been inserted into the DOM. The callback function is passed the inserted post as a jQuery object. You can use this to m




### JavaScript Widget

The WallStream JavaScript widget can be set up by including `wallstream.widget.js` in your HTML. The wall will be created exactly where you put the `<script>` tag.

Options are passed via data attributes:
- `data-wallstream-access-token`: Your wall access token (required)
- `data-wallstream-initial-limit`: The number of posts that are fetched right after the widget is loaded (optional, default: `10`)
- `data-wallstream-max-posts`: The maximum number of posts that can be in the widget at one time (optional, default: `10`, pass `false` for unlimited posts)
- `data-wallstream-interval`: The rate at which posts are fetched, in milliseconds (optional, default: `5000`, minimum: `1000`)
- `data-wallstream-insert-position`: The position where new posts are added to the DOM (possible values: `before` and `after`, default: `before`)

Example usage:
```html
<script
  src="//cdn.rawgit.com/neuling/Walls.io-Widget/master/dist/js/wallsio.widget.js"
  data-wallstream-access-token="<YOUR_ACCESS_TOKEN_HERE>"
  data-wallstream-initial-limit="10"
  data-wallstream-interval="2000">
</script>
```

### jQuery Plugin

The WallStream jQuery plugin gives you more power over the rendering of incoming posts than the simple widget. It has all the options the widget has, but camel-cased and without the `"data-wallstream"` prefix (e.g. `"data-wallstream-access-token"` becomes `"accessToken"`). The additional options are:


// NOTE: template: JST!

```html
// put this in your <head>, after jQuery!
<script src="//cdn.rawgit.com/neuling/Walls.io-Widget/master/dist/js/wallsio.jquery.js">
```

```coffee
$("#my-wall").wall
  accessToken: "ACCESS_TOKEN" # required
  initialLimit: 10
  interval: 2000
  template: "<p id='<%=id%>'><%=comment%></p>"
  beforeInsert: (html, post) ->
    html
  afterInsert: ($el, post) ->

```

### raw

```html
<script src="//cdn.rawgit.com/neuling/Walls.io-Widget/master/dist/js/wallsio.js">
```

```coffee
wall = new Wall
  accessToken: "ACCESS_TOKEN" # required
  initialLimit: 10
  interval: 2000
  onPost: (post) ->
    console.log post
```
