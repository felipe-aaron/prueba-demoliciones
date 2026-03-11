#!/bin/bash

# Como el script está dentro de la carpeta "script", guardaremos el resultado ahí mismo
OUTPUT="script/codigo_completo.txt"

# Vaciamos el archivo si ya existe para que no se duplique el contenido
> "$OUTPUT"

echo "Recolectando código de todo el proyecto..."

# Buscamos desde la raíz (.) archivos HTML, CSS y JS.
# Le decimos explícitamente que ignore la carpeta .continue, las imágenes y a sí mismo.
find . -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" \) \
    -not -path "*/\.continue/*" \
    -not -path "*/img/*" \
    -not -path "*/node_modules/*" | while read -r file; do
    
    echo "========================================" >> "$OUTPUT"
    echo "📄 Archivo: $file" >> "$OUTPUT"
    echo "========================================" >> "$OUTPUT"
    cat "$file" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
done

echo "¡Listo! El archivo $OUTPUT se generó con éxito."