# Step 1: Use official Node.js image as the base image
FROM node:18 AS build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json (or yarn.lock) files
COPY package.json package-lock.json* ./

# Step 4: Install the dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Copy .env.local to .env for production
#RUN cp .env.local .env

# Step 7: Accept build argument for Redis URL
# ARG REDIS_URL
# ENV REDIS_URL=${REDIS_URL}

# Step 8: Set environment variables to prevent Redis connection during build
ENV NEXT_PHASE=phase-production-build
ENV NODE_ENV=production

# Step 9: Build the Next.js app
RUN npm run build

# Step 9: Create a new image for serving the app
FROM node:18 AS production

# Step 10: Set the working directory
WORKDIR /app

# Step 11: Copy the necessary files from the build image
COPY --from=build /app ./

# Step 12: Install only the production dependencies
RUN npm install --production

# Step 14: Expose the port that Next.js will run on
EXPOSE 3000

# Step 15: Start the Next.js app (this uses the "start" script)
CMD ["npm", "start"]
