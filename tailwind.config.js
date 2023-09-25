/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: '#121420',
                'input-bg': '#766c7f',
                text: '#f4f4f9',
                secondary: '#a8d0db',
                primary: '#ffbc42',
                panel: '#3b4167',
                hovered: '#323651'
            }
        },
    },
    plugins: [],
}

