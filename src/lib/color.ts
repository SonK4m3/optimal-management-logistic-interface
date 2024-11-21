const generateVehicleColor = (index: number): string => {
    const colors = [
        '#FF5733', // Orange-red
        '#33FF57', // Lime green
        '#3357FF', // Blue
        '#FF33F6', // Pink
        '#33FFF6', // Cyan
        '#F6FF33' // Yellow
    ]
    return colors[index % colors.length]
}

export { generateVehicleColor }
