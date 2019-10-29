/*
 With these functions you can convert the CIE color space to the RGB color space and vice versa.

 The developer documentation for Philips Hue provides the formulas used in the code below:
 https://developers.meethue.com/documentation/color-conversions-rgb-xy

 I've used the formulas and Objective-C example code and transfered it to JavaScript.


 Examples:

 var rgb = cie_to_rgb(0.6611, 0.2936)
 var cie = rgb_to_cie(255, 39, 60)

 ------------------------------------------------------------------------------------

 The MIT License (MIT)

 Copyright (c) 2017 www.usolved.net
 Published under https://github.com/usolved/cie-rgb-converter

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

const gammaCorrect = input => (input > 0.04045) ? Math.pow((input + 0.055) / (1.0 + 0.055), 2.4) : (input / 12.92);
const reverseGammaCorrection = input => input <= 0.0031308 ? 12.92 * input : (1.0 + 0.055) * Math.pow(input, (1.0 / 2.4)) - 0.055;
const XYZtoxy = (X, Y, Z) => ([X, Y].map(it => (it / (X + Y + Z)).toFixed(4)));
const toNumber = input => isNaN(input) ? 0 : input;

/**
 * Converts CIE color space to RGB color space
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} [brightness] - Ranges from 1 to 254
 * @return {Array.<Number>} Array that contains the color values for red, green and blue
 */
export function cie_to_rgb(x, y, brightness = 254) {

	const z = 1.0 - x - y;
	const Y = (brightness / 254).toFixed(2);
	const X = (Y / y) * x;
	const Z = (Y / y) * z;

	//Convert to RGB using Wide RGB D65 conversion
	let red = X * 1.656492 - Y * 0.354851 - Z * 0.255038;
	let green = -X * 0.707196 + Y * 1.655397 + Z * 0.036152;
	let blue = X * 0.051713 - Y * 0.121364 + Z * 1.011530;

	//If red, green or blue is larger than 1.0 set it back to the maximum of 1.0
	if (red > blue && red > green && red > 1.0) {
		green = green / red;
		blue = blue / red;
		red = 1.0;
	} else if (green > blue && green > red && green > 1.0) {
		red = red / green;
		blue = blue / green;
		green = 1.0;
	} else if (blue > red && blue > green && blue > 1.0) {
		red = red / blue;
		green = green / blue;
		blue = 1.0;
	}

	return [red, green, blue]
		.map(reverseGammaCorrection)
		.map(color => Math.round(color * 255)) //Convert normalized decimal to decimal
		.map(toNumber);
}

/**
 * Converts RGB color space to CIE color space
 *
 * @param {Number} red
 * @param {Number} green
 * @param {Number} blue
 * @return {Array.<Number>} Array that contains the CIE color values for x and y
 */
export function rgb_to_cie(red, green, blue) {

	//Apply a gamma correction to the RGB values, which makes the color more vivid and more the like the color displayed on the screen of your device
	red = gammaCorrect(red);
	green = gammaCorrect(green);
	blue = gammaCorrect(blue);

	//RGB values to XYZ using the Wide RGB D65 conversion formula
	const X = red * 0.664511 + green * 0.154324 + blue * 0.162028;
	const Y = red * 0.283881 + green * 0.668433 + blue * 0.047685;
	const Z = red * 0.000088 + green * 0.072310 + blue * 0.986039;

	return XYZtoxy(X, Y, Z).map(toNumber);
}
