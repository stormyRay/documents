var Class = {
    create: function(){
        return function(){
            this.initialize.apply(this, arguments);
        }
    }
}

var Casts = Class.create();
Casts.prototype = {
    initialize: function(rootId, json) {
        this.casts = json.casts;
        this.root = $("#" + rootId);
    },
    buildDOM: function() {
        var $root = this.root;
        $root.append("<h1>The Flash Cast and Crew</h1>").css("display", "block");
        $root.append(
            $("<div></div>").append(
                _.map(this.casts, this.buildCast)
                )
            );

    },
    buildCast: function(cast, index) {
        index ++;
        var $container = $("<div></div>")
                        .addClass("container")
                        .attr("id", "container" + index);
        var $info = $("<div></div>")
                    .addClass("intro")
                    .hide()
                    .attr("id", "intro" + index)
                    .html(_.template("<h2><%= name %></h2><p><%= bio %></p>")(cast));
        var $image = $("<img></img>")
                    .addClass("image")
                    .attr("id", "image" + index)
                    .attr("src",  "./img/" + cast.img)
                    ;
        var $wrapper = $("<div></div>")
                    .addClass("wrapper")
                    .attr("id", "wrapper" + index)
                    .append($image)
                    .append($info)
                    .mouseenter(function(e){
                        $("#intro" + index).show();
                    })
                    .mouseleave(function(e){
                        $("#intro" + index).hide();
                    });
        return $container.append($wrapper);
    }
}
