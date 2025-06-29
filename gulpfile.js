import {src, dest,watch, series} from 'gulp'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'

//compilar con dartSass
const sass= gulpSass(dartSass)

export function js(done){
    src('src/js/app.js')
    .pipe(dest('build/js'))
    done()
}
//funcion para calcular
export function css(done ){
    //encontrar la ubicacion de mi archivo
    src('src/scss/app.scss', {sourcemaps: true})
    //ubica el archivo y ejecuta el pipe
        .pipe(sass().on('error', sass.logError))
        //donde se almacenara
        .pipe(dest('build/css', {sourcemaps: true}))
    done()
}

export function dev(){
    //escucha archivos
    //buscar todos los archivos que tengan la extension .scss
    watch('src/scss/**/*.scss', css)
    watch('src/js/**/*.js', js)
}
export default series(js, css, dev)
