window.onload = function () {
    const STROKE_STYLE = 'rgb(59,241,0)';
    const FILL_STYLE = 'rgba(50, 200, 0, 0.3)';
    const SELECT_DELTA = 4;

    let context = null;
    let cnvs = document.getElementById('canvas');
    let points = [];
    let movable_point = null;

    if (cnvs && cnvs.getContext) {
        context = cnvs.getContext('2d');
    }

    document.getElementById('inp').addEventListener('change', function (e) {
        let img = new Image();
        img.onload = draw;
        img.onerror = failed;
        img.src = URL.createObjectURL(this.files[0]);
    });

    function draw() {
        cnvs.width = this.width;
        cnvs.height = this.height;
        context.strokeStyle = STROKE_STYLE;
        context.fillStyle = FILL_STYLE;

        setInterval(() => {

            context.clearRect(0, 0, cnvs.width, cnvs.height);
            context.drawImage(this, 0, 0);

            points.forEach((elem) => {
                context.beginPath()
                context.arc(elem.x, elem.y, 4, 0, Math.PI * 2, false)
                context.fillStyle = 'rgb(55,200,0)';
                context.fill();
                context.fillStyle = FILL_STYLE;
                context.stroke();
            });

            if (movable_point !== null) {
                context.beginPath()
                context.arc(points[movable_point].x, points[movable_point].y, 6, 0, Math.PI * 2, false)
                context.strokeStyle = 'rgb(66,255,0)';
                context.stroke();
                context.strokeStyle = STROKE_STYLE;
            }

            if (points.length > 0) {
                context.beginPath();
                context.moveTo(points[points.length - 1].x, points[points.length - 1].y);
                for (let i = 0; i < points.length; i++) {
                    context.lineTo(points[i].x, points[i].y);
                }
                context.fill();
                context.stroke();
            }

            let content = '[\n'
            points.forEach((elem) => {
                content += `  {"x": ${elem.x}, "y": ${elem.y}},\n`
            })
            content += ']'
            document.getElementById('json_info').textContent = content;
        }, 20)

    }

    function failed() {
        console.error("The provided file couldn't be loaded as an Image media");
    }


    cnvs.addEventListener('mousedown', function (e) {
        movable_point = null;

        points.forEach((elem) => {
            if ((elem.x - SELECT_DELTA < e.clientX - cnvs.offsetLeft) &&
                (e.clientX - cnvs.offsetLeft < elem.x + SELECT_DELTA) &&
                (elem.y - SELECT_DELTA < e.clientY - cnvs.offsetTop) &&
                (e.clientY - cnvs.offsetTop < elem.y + SELECT_DELTA)) {
                console.log('sdf')
                movable_point = points.indexOf(elem);
            }

        })
    });

    cnvs.addEventListener('mousemove', function (e) {
        if (movable_point !== null) {
            points[movable_point].x = e.clientX - cnvs.offsetLeft;
            points[movable_point].y = e.clientY - cnvs.offsetTop;
        }
    })

    cnvs.addEventListener('mouseup', function (e) {
        if (movable_point !== null) {
            movable_point = null
        } else {
            let point = {x: e.clientX - cnvs.offsetLeft, y: e.clientY - cnvs.offsetTop};
            points.push(point);
        }
    })

    document.addEventListener('keydown', (e) => {
        console.log(e.key);
        if ((e.key === 'Delete') && (movable_point !==null)) {

            points.splice(movable_point, 1)
        }
    })

}