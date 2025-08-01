# Source code for the repos
ARG UI_SOURCE_CODE=./frontend
ARG BFF_SOURCE_CODE=./bff

# Set the base images for the build stages
ARG NODE_BASE_IMAGE=node:20
ARG GOLANG_BASE_IMAGE=golang:1.24.3
ARG DISTROLESS_BASE_IMAGE=gcr.io/distroless/static:nonroot

# UI build stage
FROM ${NODE_BASE_IMAGE} AS ui-builder

ARG UI_SOURCE_CODE
ARG DEPLOYMENT_MODE
ARG STYLE_THEME

WORKDIR /usr/src/app

# Copy the source code to the container
COPY ${UI_SOURCE_CODE} /usr/src/app

# Install the dependencies and build
RUN npm cache clean --force
RUN npm ci --omit=optional
RUN npm run build:prod

# BFF build stage
FROM ${GOLANG_BASE_IMAGE} AS bff-builder

ARG BFF_SOURCE_CODE

ARG TARGETOS
ARG TARGETARCH

WORKDIR /usr/src/app

# Copy the Go Modules manifests
COPY ${BFF_SOURCE_CODE}/go.mod ${BFF_SOURCE_CODE}/go.sum ./

# Download dependencies
RUN go mod download

# Copy the go source files
COPY ${BFF_SOURCE_CODE}/cmd/ cmd/
COPY ${BFF_SOURCE_CODE}/internal/ internal/

# Build the Go application
RUN CGO_ENABLED=0 GOOS=${TARGETOS:-linux} GOARCH=${TARGETARCH} go build -a -o bff ./cmd

# Final stage
# Use distroless as minimal base image to package the application binary
FROM ${DISTROLESS_BASE_IMAGE}
WORKDIR /
COPY --from=bff-builder /usr/src/app/bff ./
COPY --from=ui-builder /usr/src/app/dist ./static/
USER 65532:65532

# Expose port 8080
EXPOSE 8080

ENTRYPOINT ["/bff"]
