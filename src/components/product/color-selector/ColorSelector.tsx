'use client';
import React from 'react';
import clsx from 'clsx';

interface Props {
    selectedColor?: string;
    availableColors: string[];
    onColorChanged: (color: string) => void;
}

export function ColorSelector({ selectedColor, availableColors, onColorChanged }: Props) {
    return (
        <div className="my-5">
            <h3 className="font-bold mb-2">Colores disponibles</h3>
            <div className="flex">
                {availableColors.map((color) => (
                    <button
                        key={color}
                        onClick={() => onColorChanged(color)}
                        className={clsx(
                            "w-8 h-8 rounded-full mr-2 border-2",
                            {
                                "border-black": selectedColor === color,
                                "border-gray-300": selectedColor !== color,
                                "bg-[color]": true, // usar tu color como background
                            }
                        )}
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>
        </div>
    );
}
