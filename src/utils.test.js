import {HSVtoHSL} from "./utils";

test.each`
    HSV                          | expected
    ${{H: 123, S: 0.5, V: 0.5}}  | ${{H: 123, S: 0.33, L: 0.375}}
    ${{H: 123, S: 0.5, V: 0}}    | ${{H: 123, S: 0, L: 0}}
    ${{H: 123, S: 0, V: 1}}      | ${{H: 123, S: 0, L: 1}}
`('returns $expected on HSVtoHSL($HSV)', ({HSV, expected}) => {
    const HSL = HSVtoHSL(HSV);
    expect(HSL.H).toBeCloseTo(expected.H);
    expect(HSL.S).toBeCloseTo(expected.S);
    expect(HSL.L).toBeCloseTo(expected.L);
});
