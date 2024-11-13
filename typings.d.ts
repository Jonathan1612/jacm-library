declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
}

declare module "*.jpg" {
    const value: any;
    export default value;
}

declare module "*.svg" {
    const value: any;
    export default value;
}

declare module "*.test" {
    const value: any;
    export default value;
}


declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}