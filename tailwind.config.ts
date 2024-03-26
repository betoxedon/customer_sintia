/** @type {import('tailwindcss').Config} */
export default {
   content: ['index.html', './src/**/*.{vue,js}'],
   theme: {
      extend: {
         fontSize: {
            sm: ['12px', '17px'],
            base: ['15px', '19px'],
            lg: ['17px', '22px'],
            xl: ['19px', '25px'],
         },
         screens: {
            lapt: '1024px',
            desk: '1280px',
            maxw: '1660px',
         },
         container: {
            padding: {
               DEFAULT: '12px',
               maxw: '24px',
            },
            center: {
               center: true,
            },
         },
         colors: {
            'secondary-95': '#92a3d8',
            'primary-40': '#6590fd',
            'primary-30': '#536cbc',
            'primary-20': '#9eabd6',
            'primary-10': '#d4dbef',
            'primary-5': '#d7ddec',
            'surface-30': '#e7e9f1',
            'surface-20': '#e9ebf1',
            'surface-10': '#f1f3f9',
            'onsurface-30': '#0f172a',
            'onsurface-20': '#64748b',
            'onsurface-10': '#94a3b8',
            positive: '#53a056',
            warning: '#f8e0b8',
            error: '#F87171',
         },
      },
   },
   plugins: [require('@tailwindcss/forms')],
}
