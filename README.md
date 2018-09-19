# Under the Umbrella

This repository contains the development files for the application Under the Umbrella.

## About Under the Umbrella

### Under the Umbrella

*How well do you know the animals in the mountains of China?*

Under the umbrella is a game for exploring camera trap photographs of animals from the mountains of China, including the giant panda. Users are tested on their ability to correctly identify animals pictured in five camera trap photos. Three animal names are provided and the user must select the one corresponding to the animal in the photo.

This application is built with Vue.js.

### Data and data sources

The data for this application consists of images obtained from the [eMammal photo archive](https://emammal.si.edu/favorite-photos) and a .csv file containing corresponding metadata for each image compiled by staff at the Smithsonian's National Zoo and Conservation Biology Institute. This data is located within the assets folder: `src > assets` – images are .jpg files located in the folder `images` and metadata is in the file `imageData.csv`.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
