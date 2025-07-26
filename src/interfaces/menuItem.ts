export  default interface MenuItem {
    label: string;        // Texto a mostrar
    url?: string;         // Ruta o enlace asociado
    children?: MenuItem[]; // Submenús (opcional)
}