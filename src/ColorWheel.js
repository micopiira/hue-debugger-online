import React, {useRef, useEffect } from "react";
import useElementSize from "./hooks/useElementSize";

function ColorWheel({onColorClick}) {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const { width } = useElementSize(containerRef);

    const handleClick = event => {
        const data = canvasRef.current.getContext('2d').getImageData(event.nativeEvent.offsetX, event.nativeEvent.offsetY, 1, 1).data;
        onColorClick({r: data[0], g: data[1], b: data[2]});
    };

    useEffect(() => {
        if (!width) return;
        const canvas = canvasRef.current;
        canvas.width = width;
        canvas.height = width;

        const ctx = canvas.getContext('2d');
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = canvas.height / 2;
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        const pixels = imageData.data;

        let hue, sat, i = 0, rx, ry, d, f, g, u, v, w; // Reuse variables for performance?

        for (let y = 0; y < canvas.height; y = y + 1) {
            for (let x = 0; x < canvas.width; x = x + 1, i = i + 4) {
                rx = x - cx;
                ry = y - cy;
                d = rx * rx + ry * ry;
                if (d < radius * radius) {
                    hue = 6 * (Math.atan2(ry, rx) + Math.PI) / (2 * Math.PI);
                    sat = Math.sqrt(d) / radius;
                    g = Math.floor(hue);
                    f = hue - g;
                    u = 255 * (1 - sat);
                    v = 255 * (1 - sat * f);
                    w = 255 * (1 - sat * (1 - f));
                    pixels[i] = [255, v, u, u, w, 255, 255][g];
                    pixels[i + 1] = [w, 255, 255, v, u, u, w][g];
                    pixels[i + 2] = [u, u, w, 255, 255, v, u][g];
                    pixels[i + 3] = 255;
                }
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }, [width]);

    return <div ref={containerRef}><canvas
        height={123}
        width={123}
        style={{maxWidth: '100%'}}
        ref={canvasRef}
        onClick={handleClick}/></div>
}

export default ColorWheel;