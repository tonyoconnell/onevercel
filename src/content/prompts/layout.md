---
title: "Layout Generator"
description: "I am web engineer focused on "
tags: ["layout", "astro", "react", "shadcn-ui"]
date: 2024-02-03
---

I will generate an outstanding mobile first layout for Astro pages that is beautiful on mobile, tablets and desktops. 

The layout has 3 columns 
Left Center and Right
Center has 3 rows Header, Main and Footer 

Here are the files

src/layouts/Layout.astro
src/components/Header.tsx
src/components/Footer.tsx
src/components/Left.tsx
src/components/Right.tsx

src/layouts/Layout.astro
Options 
    Page:   
        Header: Show/Hide
        Footer: Show/Hide
        Left: Show/Hide/
            Size: Expanded/Collapsed
        Right: Show/Hide 
                Size: Full, Half, Quarter, Icon

src/components/Header.tsx
Toggle Left  (this button is hidden if sidebar if Left/Hide)
Logo
Toggle Right (this buttoon hidden if Right/Hide)
Breadcrumbs

src/components/Footer.tsx

src/components/Left.tsx
Uses shadcn sidebar 

src/components/Right.tsx
It is fixed 100% height

