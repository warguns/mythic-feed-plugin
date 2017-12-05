
photos = [];

imageElements = [];
codes = [];

function loadImages(images, codes) {
    for(var i=0; i<images.length; i++){
        imageElements[i] = new Image();
        imageElements[i].setAttribute("class", "image"+i);
        imageElements[i].setAttribute("code", codes[i]);
        imageElements[i].onload = function(){
            photos.push({src: this.src, ar: this.width / this.height, code: this.getAttribute('code')})
            // console.log({src: this.src, ar: this.width / this.height});
        };
        imageElements[i].src = images[i];
    }
}

function floodDOM(){
    workspace = document.getElementById('workspace');
    workspace.innerHTML = "";
    viewport_width = window.innerWidth - 100;
    ideal_height = parseInt(window.innerHeight / 2);
    summed_width = photos.reduce((function(sum, p) {
        return sum += p.ar * ideal_height;
    }), 0);
    rows = Math.round(summed_width / viewport_width);

    weights = photos.map(function(p) {
        return parseInt(p.ar * 100);
    });
    partition = part(weights, rows);

    index = 0;
    x = photos.slice(0);
    row_buffer = [];

    for (var i = 0; i < partition.length; i++) {
        // console.log(partition[i])
        var summed_ratios;
        row_buffer = [];
        for (var j = 0; j<partition[i].length; j++) {
            row_buffer.push(photos[index++])
        };
        summed_ratios = row_buffer.reduce((function(sum, p) {
            return sum += p.ar;
        }), 0);
        littleExtraWidth = 0.0;
        for (var k = 0; k<row_buffer.length; k++) {
            photo = row_buffer[k]
            elem = document.createElement("div");
            elem.id = "photodiv"+ i + k;
            windowWidth = workspace.clientWidth;
            normalWidth = Math.floor(windowWidth / row_buffer.length);
            littleExtraWidth += parseFloat(windowWidth / row_buffer.length) - normalWidth;
            if ((k+1) === row_buffer.length) {
                elem.style.width = Math.round(normalWidth + Math.round(littleExtraWidth)) +"px";
            } else {
                elem.style.width = normalWidth +"px";
            }

            elem.style.height = parseInt(windowWidth / row_buffer.length)+"px";
            elem.setAttribute("class", "photo");

            da = x.shift();
            alink = document.createElement('a');
            alink.id = "link" +i+k;
            alink.target = "blank";
            alink.href = "https://www.instagram.com/p/" + da.code +"/";
            imga = document.createElement("img");
            imga.src = da.src;
            imga.setAttribute("class", "photoimg");
            // console.log(elem, parseInt(viewport_width / row_buffer.length) / parseInt(viewport_width / row_buffer.length));
            console.log(window.innerWidth, row_buffer.length);
            document.getElementById('workspace').appendChild(elem);
            document.getElementById('photodiv' + i + k).appendChild(alink);
            document.getElementById('link' + i + k).appendChild(imga);


        }
    }
    console.log({'viewport_width': viewport_width, 'ideal_height': ideal_height, 'summed_width': summed_width, 'rows': rows, 'weights': weights, 'partition': partition, "row_buffer": row_buffer})
}
window.onresize = function(){
    if (imageElements.length > 0) {
        floodDOM();
    }
}