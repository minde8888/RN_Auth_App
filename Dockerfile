FROM node:lts-alpine

# Install Android SDK and emulator dependencies
RUN apk update && \
    apk add --no-cache openjdk8-jre bash libc6-compat libstdc++ && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-7583922_latest.zip -O /tmp/tools.zip && \
    unzip /tmp/tools.zip -d /opt/android-sdk && \
    rm -v /tmp/tools.zip

# Set the Android SDK path
ENV ANDROID_SDK_ROOT /opt/android-sdk

# Create and start the Android emulator
RUN yes | sdkmanager --licenses && \
    sdkmanager --update && \
    sdkmanager "platform-tools" "emulator" "platforms;android-30" "system-images;android-30;google_apis;x86" && \
    echo "no" | avdmanager --verbose create avd --force --name test --device "pixel" --package "system-images;android-30;google_apis;x86" --tag "google_apis" && \
    emulator -avd test -no-window -no-audio &


ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN yarn install --production --silent && mv node_modules ../
COPY . .
EXPOSE 8080
RUN chown -R node /usr/src/app
USER node
CMD ["yarn", "start"]
