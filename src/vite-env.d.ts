/// <reference types="vite/client" />

import * as React from "react";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "model-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
                children?: any[],
                src?: string,
                orientation?: string,
                "camera-orbit"?: string,
                "min-camera-orbit"?: string,
                "max-camera-orbit"?: string,
                "interpolation-decay"?: string,
                "rotation-per-second"?: string,
                "auto-rotate"?: boolean,
                "auto-rotate-delay"?: string,
                "ar-modes"?: string,
                "camera-controls"?: boolean,
                "shadow-intensity"?: string,
                "disable-pan"?: boolean,
                "disable-tap"?: boolean,
                "ar-status"?: string
            }, HTMLElement>;
        }
    }
};