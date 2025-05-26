
export function getPostHogKey() {
  const encoded = [
    String.fromCharCode(112, 104, 99, 95),  // 'phc_'
    String.fromCharCode(102, 48, 48, 52),   // 'f004'
    String.fromCharCode(71, 118, 56, 51),   // 'Gv83'
    String.fromCharCode(65, 107, 102, 88),  // 'AkfX'
    String.fromCharCode(104, 50, 87, 74),   // 'h2WJ'
    String.fromCharCode(57, 88, 81, 55),    // '9XQ7'
    String.fromCharCode(122, 113, 97, 117), // 'zqau'
    String.fromCharCode(106, 103, 97, 106), // 'jgaj'
    String.fromCharCode(103, 105, 83, 51),  // 'giS3'
    String.fromCharCode(89, 88, 69, 89),    // 'YXEY'
    String.fromCharCode(97, 53, 50, 69),    // 'a52E'
    String.fromCharCode(118, 102, 112)      // 'vfp'
  ];
  return encoded.join('');
}

export const POSTHOG_HOST = 'https://us.i.posthog.com';
