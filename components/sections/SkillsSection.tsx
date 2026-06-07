'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '@/lib/contexts/AudioContext';

const clip4 = 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)';
const clip6 = 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)';
const FONT_CINZEL = '"Cinzel", "Georgia", serif';
const FONT_MONO   = '"JetBrains Mono", "Courier New", monospace';

const C_PRIMARY   = '#FFFFFF';
const C_SECONDARY = '#E0E0E8';
const C_MUTED     = '#B8B8C4';
const C_DIM       = '#888898';
const C_GREEN     = '#7EE89A';

const BRAND_COLORS: Record<string, string> = {
  React:         '#61DAFB',
  NextJS:        '#FFFFFF',
  TypeScript:    '#3178C6',
  TailwindCSS:   '#06B6D4',
  HTML:          '#E34F26',
  CSS:           '#1572B6',
  JavaScript:    '#F7DF1E',
  Supabase:      '#3ECF8E',
  NodeJS:        '#339933',
  Android:       '#3DDC84',
  Java:          '#ED8B00',
  AndroidStudio: '#3DDC84',
  ReactNative:   '#61DAFB',
  Figma:         '#F24E1E',
  Photoshop:     '#31A8FF',
  PostgreSQL:    '#4169E1',
  SQL:           '#E48E00',
  GitHub:        '#FFFFFF',
  Git:           '#F05032',
};

const ICONS: Record<string, React.FC<{ size?: number; color?: string }>> = {
  React: ({ size = 40, color = '#61DAFB' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="2.05" fill={color}/>
      <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke={color} strokeWidth="1.1" fill="none"/>
      <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke={color} strokeWidth="1.1" fill="none" transform="rotate(60 12 12)"/>
      <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke={color} strokeWidth="1.1" fill="none" transform="rotate(120 12 12)"/>
    </svg>
  ),
  NextJS: ({ size = 40, color = '#FFFFFF' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.049-.106.005-4.703.007-4.705.073-.091a.637.637 0 0 1 .174-.143c.096-.047.134-.052.54-.052.479 0 .558.019.683.155a466.83 466.83 0 0 1 2.895 4.361c1.558 2.362 3.687 5.587 4.734 7.171l1.9 2.878.096-.063a12.317 12.317 0 0 0 2.465-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z"/>
    </svg>
  ),
  TypeScript: ({ size = 40, color = '#3178C6' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/>
    </svg>
  ),
  TailwindCSS: ({ size = 40, color = '#06B6D4' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
    </svg>
  ),
  HTML: ({ size = 40, color = '#E34F26' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/>
    </svg>
  ),
  CSS: ({ size = 40, color = '#1572B6' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"/>
    </svg>
  ),
  JavaScript: ({ size = 40, color = '#F7DF1E' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/>
    </svg>
  ),
  Supabase: ({ size = 40, color = '#3ECF8E' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.113 7.51c.015.985 1.259 1.408 1.874.636l9.262-11.653c1.093-1.375.113-3.403-1.645-3.403h-9.58L11.9 1.036z"/>
    </svg>
  ),
  NodeJS: ({ size = 40, color = '#339933' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M11.998 24c-.321 0-.641-.084-.924-.251l-2.937-1.737c-.439-.245-.225-.332-.08-.383.585-.203.703-.249 1.327-.603.065-.037.151-.023.218.017l2.256 1.339c.082.045.198.045.275 0l8.795-5.076c.082-.047.134-.141.134-.238V6.921c0-.099-.053-.19-.137-.242L11.13 1.604a.271.271 0 0 0-.274 0L2.061 6.68c-.085.05-.139.146-.139.241v10.15c0 .097.054.189.139.235l2.409 1.392c1.307.654 2.108-.116 2.108-.891V7.787c0-.142.114-.253.256-.253h1.115c.139 0 .255.111.255.253v10.021c0 1.745-.95 2.745-2.604 2.745-.508 0-.909 0-2.026-.551L.917 18.67a1.852 1.852 0 0 1-.917-1.603V6.921c0-.661.353-1.278.917-1.605L8.71.239a1.906 1.906 0 0 1 1.847 0l7.793 4.077c.563.329.917.944.917 1.605v10.15c0 .659-.354 1.273-.917 1.603l-7.793 4.502c-.282.165-.603.249-.924.249l.365-.425z"/>
    </svg>
  ),
  Android: ({ size = 40, color = '#3DDC84' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4483-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993 0 .5511-.4483.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 0 0-.1521-.5676.416.416 0 0 0-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4467a.4161.4161 0 0 0-.5677-.1521.4157.4157 0 0 0-.1521.5676l1.9973 3.4592C3.7889 10.1812 2.2372 12.4608 2.2372 15.0s.0002 0 0 0H21.763s0 0 0 0c0-2.5392-1.5517-4.8188-3.8815-5.6786"/>
    </svg>
  ),
  Java: ({ size = 40, color = '#ED8B00' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218M13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0-.001-8.216 2.051-4.292 6.573M19.33 20.504s.679.559-.747.991c-2.712.822-11.288 1.069-13.669.033-.856-.373.75-.89 1.254-.998.527-.114.828-.093.828-.093-.953-.671-6.156 1.317-2.643 1.887 9.58 1.553 17.462-.7 14.977-1.82M9.292 13.21s-4.362 1.036-1.544 1.412c1.189.159 3.561.123 5.77-.062 1.806-.152 3.618-.477 3.618-.477s-.637.272-1.098.587c-4.429 1.165-12.986.623-10.522-.568 2.082-1.006 3.776-.892 3.776-.892M17.116 17.584c4.503-2.34 2.421-4.589.968-4.285-.355.074-.515.138-.515.138s.132-.207.385-.297c2.875-1.011 5.086 2.981-.928 4.562 0-.001.07-.062.09-.118M14.401 0s2.494 2.494-2.365 6.33c-3.896 3.077-.888 4.832-.001 6.836-2.274-2.053-3.943-3.858-2.824-5.539 1.644-2.469 6.197-3.665 5.19-7.627M9.734 23.924c4.322.277 10.959-.153 11.116-2.198 0 0-.302.775-3.572 1.391-3.688.694-8.239.613-10.937.168 0-.001.553.457 3.393.639"/>
    </svg>
  ),
  AndroidStudio: ({ size = 40, color = '#3DDC84' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M0 0l8 8-8 8V0zm16.002 0L8 8l8.002 8L24 8 16.002 0zM0 16l8 8 8.002-8L8 8 0 16z"/>
    </svg>
  ),
  ReactNative: ({ size = 40, color = '#61DAFB' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="2.05" fill={color}/>
      <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke={color} strokeWidth="1.1" fill="none"/>
      <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke={color} strokeWidth="1.1" fill="none" transform="rotate(60 12 12)"/>
      <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke={color} strokeWidth="1.1" fill="none" transform="rotate(120 12 12)"/>
    </svg>
  ),
  Figma: ({ size = 40, color = '#F24E1E' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.098-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z"/>
    </svg>
  ),
  Photoshop: ({ size = 40, color = '#31A8FF' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M0 4.002C0 1.794 1.794 0 4.002 0h15.996C22.206 0 24 1.794 24 4.002v15.996C24 22.206 22.206 24 19.998 24H4.002C1.794 24 0 22.206 0 19.998V4.002zm8.208 4.044c-.714 0-1.422.036-2.154.072v7.662c.39.036.738.048 1.086.048 2.454 0 4.14-1.212 4.14-4.02.012-2.43-1.458-3.762-3.072-3.762zm-.354 6.546a4.09 4.09 0 0 1-.594-.03V9.296c.174-.03.39-.042.714-.042 1.374 0 2.232.762 2.22 2.592 0 1.998-.906 2.748-2.34 2.748zm7.482-4.14c-1.23 0-2.082.9-2.082 2.268 0 1.32.816 2.196 1.998 2.196 1.176 0 2.082-.822 2.082-2.244 0-1.338-.828-2.22-1.998-2.22zm-.042 3.69c-.654 0-1.032-.63-1.032-1.458 0-.816.39-1.47 1.044-1.47.666 0 1.038.666 1.038 1.476 0 .84-.396 1.452-1.05 1.452z"/>
    </svg>
  ),
  PostgreSQL: ({ size = 40, color = '#4169E1' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M17.128 0a10.134 10.134 0 0 0-2.755.403l-.063.02A10.922 10.922 0 0 0 12.6.258C11.422.238 10.318.5 9.555.988a.44.44 0 0 0-.15.152A7.315 7.315 0 0 0 7.43.74l-.063.01-.046.01a7.16 7.16 0 0 0-3.897 2.256A7.215 7.215 0 0 0 1.5 7.23a12.87 12.87 0 0 0 .057 1.994c.124 1.402.398 2.7.84 3.63.286.596.637.924 1.07.993.222.036.47.007.727-.08 0 .007.003.013.005.02a6.548 6.548 0 0 0 .347.786l-.01.017-.1.177-.023.04c-.351.632-.412 1.213-.18 1.693.186.384.558.63 1.048.696.35.048.744.01 1.155-.107a7.84 7.84 0 0 0 1.157-.455 10.534 10.534 0 0 0 1.405-.88 12.714 12.714 0 0 0 1.132-.988 15.168 15.168 0 0 0 .693.217c.502.14 1.009.232 1.394.254 0 .01.002.017.003.025.043.374.083.73.147 1.062.1.517.247.95.5 1.207.124.127.27.21.436.249a.856.856 0 0 0 .47-.034c.467-.155.813-.615 1.096-1.191a19.032 19.032 0 0 0 .697-1.798c.204-.02.424-.05.658-.09 1.116-.19 2.178-.553 2.9-.975.33-.19.6-.39.79-.597.096-.105.17-.211.22-.321.05-.112.073-.23.063-.356a.619.619 0 0 0-.063-.232A.66.66 0 0 0 18.4 12.7a.949.949 0 0 0-.217-.16 3.187 3.187 0 0 0-.613-.24c-.12-.034-.245-.066-.373-.097a.36.36 0 0 0 .034-.068 9.903 9.903 0 0 0 .294-.884c.247-.854.4-1.714.4-2.434v-.048c0-.02.001-.041.001-.062 0-4.44-3.513-8.08-7.853-8.238L9.89.467A8.316 8.316 0 0 0 8.5.424 8.34 8.34 0 0 0 6.928.6l.002-.004z"/>
    </svg>
  ),
  SQL: ({ size = 40, color = '#E48E00' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm0 2c3.86 0 6 1.38 6 2s-2.14 2-6 2-6-1.38-6-2 2.14-2 6-2zM6 9.41C7.28 10.39 9.49 11 12 11s4.72-.61 6-1.59V11c0 .62-2.14 2-6 2s-6-1.38-6-2V9.41zm0 4C7.28 14.39 9.49 15 12 15s4.72-.61 6-1.59V15c0 .62-2.14 2-6 2s-6-1.38-6-2v-1.59zm0 4C7.28 18.39 9.49 19 12 19s4.72-.61 6-1.59V19c0 .62-2.14 2-6 2s-6-1.38-6-2v-1.59z"/>
    </svg>
  ),
  GitHub: ({ size = 40, color = '#FFFFFF' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  ),
  Git: ({ size = 40, color = '#F05032' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.604-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.67 .45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187"/>
    </svg>
  ),
};

interface TechItem { name: string; iconKey: string; }

const CATEGORIES = [
  {
    id: 'frontend', label: 'Frontend Development', shortLabel: 'Frontend', code: 'ATTR-FE',
    skills: [
      { name: 'React / Next.js' }, { name: 'TypeScript' }, { name: 'Tailwind CSS' },
      { name: 'HTML / CSS' }, { name: 'JavaScript' },
    ],
    techStack: [
      { name: 'React',      iconKey: 'React'       },
      { name: 'Next.js',    iconKey: 'NextJS'      },
      { name: 'TypeScript', iconKey: 'TypeScript'  },
      { name: 'Tailwind',   iconKey: 'TailwindCSS' },
      { name: 'HTML5',      iconKey: 'HTML'        },
      { name: 'CSS3',       iconKey: 'CSS'         },
      { name: 'JavaScript', iconKey: 'JavaScript'  },
    ] as TechItem[],
  },
  {
    id: 'backend', label: 'Backend Development', shortLabel: 'Backend', code: 'ATTR-BE',
    skills: [
      { name: 'Supabase' }, { name: 'REST APIs' }, { name: 'Node.js' }, { name: 'Database Design' },
    ],
    techStack: [
      { name: 'Supabase',   iconKey: 'Supabase'   },
      { name: 'Node.js',    iconKey: 'NodeJS'     },
      { name: 'JavaScript', iconKey: 'JavaScript' },
      { name: 'TypeScript', iconKey: 'TypeScript' },
    ] as TechItem[],
  },
  {
    id: 'mobile', label: 'Mobile Development', shortLabel: 'Mobile', code: 'ATTR-MOB',
    skills: [
      { name: 'Android Dev (Java)' }, { name: 'Android Studio' }, { name: 'React Native' },
    ],
    techStack: [
      { name: 'Android',        iconKey: 'Android'       },
      { name: 'Java',           iconKey: 'Java'          },
      { name: 'Android Studio', iconKey: 'AndroidStudio' },
      { name: 'React Native',   iconKey: 'ReactNative'   },
    ] as TechItem[],
  },
  {
    id: 'uiux', label: 'UI/UX Design', shortLabel: 'UI/UX', code: 'ATTR-UX',
    skills: [
      { name: 'UI Design' }, { name: 'Responsive Design' }, { name: 'Photoshop' }, { name: 'User Research' },
    ],
    techStack: [
      { name: 'Figma',     iconKey: 'Figma'      },
      { name: 'Photoshop', iconKey: 'Photoshop'  },
      { name: 'CSS3',      iconKey: 'CSS'        },
      { name: 'Tailwind',  iconKey: 'TailwindCSS'},
    ] as TechItem[],
  },
  {
    id: 'db', label: 'Database Management', shortLabel: 'Database', code: 'ATTR-DB',
    skills: [
      { name: 'PostgreSQL' }, { name: 'Supabase DB' }, { name: 'SQL' },
    ],
    techStack: [
      { name: 'PostgreSQL', iconKey: 'PostgreSQL' },
      { name: 'Supabase',   iconKey: 'Supabase'   },
      { name: 'SQL',        iconKey: 'SQL'         },
    ] as TechItem[],
  },
  {
    id: 'system', label: 'System Design', shortLabel: 'System', code: 'ATTR-SYS',
    skills: [
      { name: 'Architecture' }, { name: 'Version Control' }, { name: 'GitHub' },
    ],
    techStack: [
      { name: 'GitHub', iconKey: 'GitHub' },
      { name: 'Git',    iconKey: 'Git'    },
    ] as TechItem[],
  },
  {
    id: 'problem', label: 'Problem Solving', shortLabel: 'Problem', code: 'ATTR-PS',
    skills: [
      { name: 'Algorithms' }, { name: 'Debugging' }, { name: 'System Thinking' },
    ],
    techStack: [
      { name: 'TypeScript', iconKey: 'TypeScript' },
      { name: 'JavaScript', iconKey: 'JavaScript' },
      { name: 'GitHub',     iconKey: 'GitHub'     },
    ] as TechItem[],
  },
];

function OrnateDivider() {
  return (
    <div className="flex items-center justify-center my-3 w-full" style={{ opacity: 0.8 }}>
      <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, #C8C8D8, transparent)' }} />
      <span className="mx-2 text-[10px] border p-[2px] leading-none flex items-center justify-center transform rotate-45"
        style={{ color: '#C8C8D8', borderColor: 'rgba(200,200,216,0.5)' }}>◈</span>
      <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, #C8C8D8, transparent)' }} />
    </div>
  );
}

function TechStackGrid({ items, isMobile = false }: { items: TechItem[]; isMobile?: boolean }) {
  /* Bigger on both breakpoints */
  const tileSize = isMobile ? 72 : 88;
  const iconSize = isMobile ? 38 : 48;

  return (
    <div style={{
      background: 'rgba(6,6,8,0.9)',
      border:     '1px solid rgba(255,255,255,0.1)',
      padding:    isMobile ? '16px' : '20px',
      clipPath:   clip6,
    }}>
      {/* Header */}
      <p style={{
        fontFamily:    FONT_MONO,
        fontSize:      isMobile ? '0.82rem' : '0.9rem',
        fontWeight:    800,
        letterSpacing: '0.2em',
        color:         C_SECONDARY,
        textTransform: 'uppercase',
        marginBottom:  '1rem',
        paddingBottom: '0.5rem',
        borderBottom:  '1px solid rgba(255,255,255,0.1)',
      }}>
        Tech Stack
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? 14 : 18 }}>
        {items.map((tech, i) => {
          const IconComp   = ICONS[tech.iconKey];
          const brandColor = BRAND_COLORS[tech.iconKey] ?? C_SECONDARY;
          const glowBg     = `${brandColor}14`;

          return (
            <motion.div
              key={tech.name}
              className="flex flex-col items-center"
              style={{ gap: 8, minWidth: tileSize }}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: i * 0.045 }}
            >
              {/* Icon tile */}
              <div
                style={{
                  width:          tileSize,
                  height:         tileSize,
                  background:     'rgba(10,10,14,0.95)',
                  border:         '1px solid rgba(255,255,255,0.12)',
                  clipPath:       clip4,
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  transition:     'all 0.18s ease',
                  cursor:         'default',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background  = glowBg;
                  el.style.borderColor = `${brandColor}55`;
                  el.style.boxShadow   = `0 0 22px ${brandColor}30, inset 0 0 12px ${brandColor}12`;
                  el.style.transform   = 'scale(1.06)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background  = 'rgba(10,10,14,0.95)';
                  el.style.borderColor = 'rgba(255,255,255,0.12)';
                  el.style.boxShadow   = 'none';
                  el.style.transform   = 'scale(1)';
                }}
              >
                {IconComp
                  ? <IconComp size={iconSize} color={brandColor} />
                  : <span style={{ fontFamily: FONT_MONO, fontSize: '0.7rem', fontWeight: 800, color: brandColor }}>
                      {tech.name.slice(0, 3).toUpperCase()}
                    </span>
                }
              </div>

              {/* Label — bigger & bolder */}
              <span style={{
                fontFamily:    FONT_MONO,
                fontSize:      isMobile ? '0.72rem' : '0.78rem',
                fontWeight:    800,
                letterSpacing: '0.08em',
                color:         C_SECONDARY,
                textTransform: 'uppercase',
                textAlign:     'center',
                maxWidth:      tileSize + 12,
                overflow:      'hidden',
                textOverflow:  'ellipsis',
                whiteSpace:    'nowrap',
              }}>
                {tech.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const { playHover, playToggle } = useAudio();
  const [activeCategory, setActiveCategory] = useState('frontend');
  const cat = CATEGORIES.find(c => c.id === activeCategory)!;

  const handleSelect = (id: string) => { setActiveCategory(id); playToggle(); };

  return (
    <motion.div
      className="fixed inset-0 z-10 flex flex-col md:flex-row overflow-hidden max-md:!pl-0 md:pl-[clamp(280px,30vw,400px)] pt-16 md:pt-0"
      style={{ background: '#050505', color: C_PRIMARY }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
    >
      <div style={{
        position: 'fixed', top: '40%', left: '55%', width: '60vw', height: '60vw', borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, rgba(200,200,216,0.04) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ══ MOBILE ══ */}
      <div className="flex flex-col flex-1 overflow-hidden md:hidden relative z-10">
        <div className="flex-shrink-0 px-4 pt-4 pb-2">
          <h2 style={{ fontFamily: FONT_CINZEL, fontWeight: 800, fontSize: '1.35rem', letterSpacing: '0.18em', color: C_PRIMARY, textTransform: 'uppercase', textShadow: '0 0 24px rgba(255,255,255,0.2)', marginBottom: 4 }}>
            Character Build
          </h2>
          <p style={{ fontFamily: FONT_MONO, fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.18em', color: C_MUTED, textTransform: 'uppercase' }}>
            Select Attribute
          </p>
          <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.3), transparent)', marginTop: 8 }} />
        </div>

        {/* Mobile tab bar */}
        <div className="flex-shrink-0 flex items-stretch overflow-x-auto px-4" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(c => {
            const isActive = activeCategory === c.id;
            return (
              <button key={c.id} onClick={() => handleSelect(c.id)} onMouseEnter={() => playHover()}
                className="flex-shrink-0 transition-all duration-150 px-3 py-3"
                style={{
                  fontFamily:    FONT_CINZEL,
                  fontWeight:    800,
                  fontSize:      '0.78rem',
                  letterSpacing: '0.09em',
                  textTransform: 'uppercase',
                  color:         isActive ? C_PRIMARY : C_DIM,
                  borderBottom:  `2px solid ${isActive ? C_PRIMARY : 'transparent'}`,
                  background:    isActive ? 'rgba(255,255,255,0.07)' : 'transparent',
                  border:        'none',
                  whiteSpace:    'nowrap',
                  cursor:        'pointer',
                  transition:    'all 0.15s',
                }}>
                {c.shortLabel}
              </button>
            );
          })}
        </div>
        <div className="flex-shrink-0 mx-4" style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />

        <div className="flex-1 overflow-y-auto scrollable px-4 pt-4 pb-16">
          <AnimatePresence mode="wait">
            <motion.div key={activeCategory} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }} className="flex flex-col gap-3">

              {/* Header card */}
              <div style={{ position: 'relative', background: 'rgba(4,4,6,0.85)', border: '1px solid rgba(255,255,255,0.18)', borderTop: '2px solid #FFFFFF', clipPath: clip6, padding: '16px 18px' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top left, rgba(255,255,255,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
                <p style={{ fontFamily: FONT_MONO, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.2em', color: C_MUTED, textTransform: 'uppercase', marginBottom: 6 }}>{cat.code} · ATTRIBUTE MODULE</p>
                <h2 style={{ fontFamily: FONT_CINZEL, fontWeight: 800, fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', color: C_PRIMARY, textTransform: 'uppercase', letterSpacing: '0.07em', textShadow: '0 0 20px rgba(255,255,255,0.2)' }}>{cat.label}</h2>
                <div className="flex items-center gap-2 mt-3">
                  <span style={{ fontFamily: FONT_MONO, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.15em', border: '1px solid rgba(126,232,154,0.5)', color: C_GREEN, background: 'rgba(126,232,154,0.08)', padding: '3px 10px', textTransform: 'uppercase', clipPath: clip4 }}>EQUIPPED</span>
                  <span style={{ fontFamily: FONT_MONO, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.15em', border: '1px solid rgba(255,255,255,0.25)', color: C_SECONDARY, padding: '3px 10px', textTransform: 'uppercase', clipPath: clip4 }}>{cat.skills.length} SKILLS</span>
                </div>
              </div>

              {/* Skill rows */}
              <div style={{ background: 'rgba(6,6,8,0.9)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px 16px', clipPath: clip6 }}>
                {cat.skills.map((skill, i) => (
                  <motion.div key={skill.name} className="flex items-center justify-between"
                    style={{ padding: '13px 0', borderBottom: i < cat.skills.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
                    initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25, delay: i * 0.06 }} onMouseEnter={() => playHover()}>
                    <div className="flex items-center gap-3">
                      <span style={{ color: C_MUTED, fontSize: '0.82rem', flexShrink: 0 }}>◈</span>
                      <span style={{ fontFamily: FONT_CINZEL, fontWeight: 800, fontSize: '1.05rem', color: C_PRIMARY, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{skill.name}</span>
                    </div>
                    <span style={{ fontFamily: FONT_MONO, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.15em', border: '1px solid rgba(126,232,154,0.5)', color: C_GREEN, background: 'rgba(126,232,154,0.08)', padding: '3px 8px', textTransform: 'uppercase', clipPath: clip4, flexShrink: 0 }}>ACTIVE</span>
                  </motion.div>
                ))}
              </div>

              {/* Tech Stack */}
              <TechStackGrid items={cat.techStack} isMobile />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ══ DESKTOP ══ */}
      <div className="hidden md:flex flex-row flex-1 overflow-hidden relative z-10">

        {/* Sidebar */}
        <motion.div className="flex flex-col py-8 pl-8 pr-4 flex-shrink-0" style={{ width: 'clamp(240px, 28vw, 320px)' }} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: FONT_CINZEL, fontWeight: 800, fontSize: '1.6rem', letterSpacing: '0.18em', color: C_PRIMARY, textTransform: 'uppercase', textShadow: '0 0 24px rgba(255,255,255,0.2)', marginBottom: 6 }}>Character Build</h2>
            <p style={{ fontFamily: FONT_MONO, fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.18em', color: C_MUTED, textTransform: 'uppercase', marginBottom: 10 }}>Select Attribute</p>
            <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.3), transparent)' }} />
          </div>

          <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto scrollable" style={{ background: 'rgba(6,6,8,0.7)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.875rem', clipPath: clip6 }}>
            {CATEGORIES.map((c, i) => {
              const isActive = activeCategory === c.id;
              return (
                <motion.button key={c.id} className="flex items-center gap-3 p-3 text-left w-full transition-all duration-200"
                  style={{ background: isActive ? 'rgba(255,255,255,0.08)' : 'rgba(4,4,6,0.7)', border: `1px solid ${isActive ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`, clipPath: clip4, boxShadow: isActive ? '0 0 16px rgba(255,255,255,0.08)' : 'none', cursor: 'pointer' }}
                  initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                  onClick={() => handleSelect(c.id)} onMouseEnter={() => playHover()}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', border: `1px solid ${isActive ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.12)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: isActive ? 'rgba(255,255,255,0.1)' : 'rgba(4,4,6,0.8)', transition: 'all 0.15s' }}>
                    <span style={{ fontFamily: FONT_MONO, fontSize: '0.65rem', fontWeight: 800, color: isActive ? C_PRIMARY : C_DIM, letterSpacing: '0.05em' }}>{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="truncate block" style={{ fontFamily: FONT_CINZEL, fontSize: '0.92rem', fontWeight: 800, color: isActive ? C_PRIMARY : C_DIM, letterSpacing: '0.06em', transition: 'color 0.15s' }}>{c.label}</span>
                    <p style={{ fontFamily: FONT_MONO, fontSize: '0.65rem', fontWeight: 700, color: isActive ? C_MUTED : '#555566', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 2 }}>{c.code} · {c.skills.length} skills</p>
                  </div>
                  {isActive && <span style={{ color: C_PRIMARY, fontSize: '1.1rem', flexShrink: 0 }}>◈</span>}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Detail panel */}
        <motion.div className="flex-1 py-8 pr-8 pl-4 overflow-y-auto scrollable" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.15 }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeCategory} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="flex flex-col gap-5">

              {/* Header card */}
              <div style={{ position: 'relative', background: 'rgba(4,4,6,0.85)', border: '1px solid rgba(255,255,255,0.2)', borderTop: '2px solid #FFFFFF', clipPath: clip6, padding: '20px 24px' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top left, rgba(255,255,255,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
                <div className="flex justify-between items-start gap-3 relative">
                  <div className="min-w-0">
                    <p style={{ fontFamily: FONT_MONO, fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.2em', color: C_MUTED, textTransform: 'uppercase', marginBottom: '0.5rem' }}>{cat.code} · ATTRIBUTE MODULE · {cat.skills.length} SKILLS</p>
                    <h2 style={{ fontFamily: FONT_CINZEL, fontWeight: 800, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: C_PRIMARY, letterSpacing: '0.06em', lineHeight: 1.15, textShadow: '0 0 24px rgba(255,255,255,0.2)' }}>{cat.label}</h2>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span style={{ fontFamily: FONT_MONO, fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em', border: '1px solid rgba(255,255,255,0.3)', color: C_SECONDARY, padding: '3px 10px', textTransform: 'uppercase', clipPath: clip4 }}>PASSIVE</span>
                    <span style={{ fontFamily: FONT_MONO, fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em', border: '1px solid rgba(126,232,154,0.5)', color: C_GREEN, background: 'rgba(126,232,154,0.08)', padding: '3px 10px', textTransform: 'uppercase', clipPath: clip4 }}>EQUIPPED</span>
                  </div>
                </div>
                <OrnateDivider />
                <p style={{ fontFamily: FONT_CINZEL, fontSize: '0.95rem', fontWeight: 600, color: C_SECONDARY, fontStyle: 'italic', lineHeight: 1.8, paddingLeft: '0.875rem', borderLeft: '2px solid rgba(255,255,255,0.3)' }}>
                  &ldquo;A cluster of {cat.skills.length} active capabilities under the {cat.label} discipline. Each skill grants passive bonuses to project quality and execution speed.&rdquo;
                </p>
              </div>

              {/* Tech Stack Grid */}
              <TechStackGrid items={cat.techStack} />

              {/* Skill tag chips */}
              <div className="flex flex-wrap gap-2">
                {cat.skills.map(s => (
                  <span key={s.name} style={{ fontFamily: FONT_MONO, fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.12em', color: C_SECONDARY, border: '1px solid rgba(255,255,255,0.25)', padding: '5px 12px', clipPath: clip4, textTransform: 'uppercase' }}>{s.name}</span>
                ))}
              </div>

            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}