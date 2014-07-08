Walls.io-Widget
===============

## Usage

### script-tag

```html
<script src="//cdn.rawgit.com/neuling/Walls.io-Widget/master/dist/js/wallsio.widget.js" data-wall-access-token="ACCESS_TOKEN" data-wall-initial-limit="10" data-wall-interval="2000">
```

### jquery-plugin

```html
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