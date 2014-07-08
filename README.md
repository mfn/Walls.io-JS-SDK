WallStream
===============

Widgets and tools for Walls.io

## Usage

There are two levels of WallStream:
- 1. The WallStream plugins for high-level access: **[WallStream Widget](#javascript-widget)** and **[WallStream jQuery](#jquery-plugin)**.
- 2. The **[`WallStreamCore`](#wallstreamcore)** class for low-level access.

Both levels share the same set of base parameters:
- `accessToken`: Your wall access token (required)
- `initialLimit`: The number of posts that are fetched after initialization (optional, default: `10`)
- `interval`: How often to check for new posts, in milliseconds (optional, default: `5000`, minimum: `1000`)
- `fields`: An array of field names you want to receive for each post (optional, default: all fields)
- `types`: An array of post types (e.g. `["twitter", "facebook"]`) that you want to receive posts for (optional, default: all types)


The plugins (both jQuery and JS widget) have several additional parameters:
- `template`: A [JST template](http://underscorejs.org/#template) that is used for rendering the post. All fields the API returns for a post are accessible in your template. You can insert variable values with `<%=variableName%>` and even use arbitrary JavaScript (see [example below](#jquery-plugin))
- `maxPosts`: The maximum number of posts that can be in the widget at one time (default: `10`, pass `false` for unlimited posts)
- `insertPosition`: The position where new posts are added to the DOM (possible values: `before` and `after`, default: `before`)

In addition to all of the above, the **[jQuery plugin](#jquery-plugin)** also supports the following callbacks:
- `beforeInsert`: A function that is passed the HTML of the rendered post, as well as the post object itself. Use this if you want to modify the post HTML before it is inserted into the DOM. You need to return the modified (or unchanged) HTML from this callback function. You can discard a post by returning `false` from this function.
- `afterInsert`: Gets called after a post has been inserted into the DOM. The function is passed the inserted post as a jQuery object.

The **[WallStreamCore class](#wallstreamcore)** has all of the base parameters, but none of the plugin options. It exposes one additional callback:
- `onPost`: This function is called once for every incoming post and is passed the raw post object.


### JavaScript Widget

The WallStream JavaScript widget can be set up by including `wallstream.widget.js` in your HTML. The wall will be created exactly where you put the `<script>` tag.

Options are passed via data attributes, prefixed with `data-wallstream-`, e.g. `data-wallstream-access-token`.

Example usage:
```html
<script
  src="//cdn.rawgit.com/neuling/WallStream/master/dist/js/wallstream.widget.js"
  data-wallstream-access-token="<YOUR_ACCESS_TOKEN_HERE>"
  data-wallstream-initial-limit="10"
  data-wallstream-interval="2000">
</script>
```

### jQuery Plugin

Example usage:

```html
<!-- put this in your <head>, after jQuery! -->
<script src="//cdn.rawgit.com/neuling/WallStream/master/dist/js/wallstream.jquery.js"></script>
```

```js
$("#my-wall").wall({
  accessToken: "<YOUR_ACCESS_TOKEN_HERE>", // required
  initialLimit: 10,
  interval: 2000,
  template: $("#my-template").html(),
  afterInsert: function($el) {
    $el.animate(/* ... */);
  }
});
```

```html
// the template
<script type="text/html" id="my-template">
<div class="post">
  <strong><%=external_name%></strong>: <%=comment%>

  <% if (post_image) { %>
    <img src="<%=post_image%>">
  <% } %>
</div>
</script>
```

### WallStreamCore

The WallStreamCore class gives you low-level access to WallStream. Use this if you want to use your own templating engine or if you want to use posts for something else than adding them to the DOM.

```html
<script src="//cdn.rawgit.com/neuling/WallStream/master/dist/js/wallstream.js"></script>
```

```js
var stream = new WallStreamCore({
  accessToken: "<YOUR_ACCESS_TOKEN_HERE>", // required
  initialLimit: 10,
  interval: 2000,
  onPost: function(post) {
    someSpeechApi.say(post.comment);
  }
});
```

