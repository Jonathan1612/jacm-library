import Label from "../components/Label/Label"; // Asegúrate de que esta ruta sea correcta.
import { Meta, StoryObj } from '@storybook/react'; // Importación correcta de Meta y StoryObj

// Definición del objeto meta, que debe satisfacer el tipo Meta
const meta: Meta<typeof Label> = {
    title: 'UI/labels/Label',
    component: Label,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered'
    }
};

export default meta;

// Definición del tipo Story basado en meta
type Story = StoryObj<typeof meta>;

// Definición de la historia básica
export const Basic: Story = {
    args: {
        name: 'Basic label', // Asegúrate de que 'label' sea una propiedad válida del componente Label
        type: 'normal',       // Asegúrate de que 'type' sea una propiedad válida del componente Label
        size: 'small'         // Asegúrate de que 'size' sea una propiedad válida del componente Label
    }
};
