### How to add a new icon

1. Add the svg file to the svg/raw directory
2. run: yarn
3. run: yarn svg
4. You should now be able to import your svg from "svg/out"

Notes:

- Running the svg script will remove any classes applied directly to the svg
- To add classes to the svg, you can pass the className's as a prop to the SVG React component produced when we run the svg script
