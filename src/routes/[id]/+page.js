import data from '$lib/data/data.json';

export const entries = Object.keys(data.index).map((key) => ({ id: key }));

// export const entries = (() => {
//     return [
//         Object.keys(data.index).map(key => {id: key})
//         // { slug: 'hello-world' },
//         // { slug: 'another-blog-post' }
//     ];
// })