cmake_minimum_required(VERSION 3.22)
project(finquant_platform NONE)

if(WIN32)
  set(GRADLEW "${CMAKE_SOURCE_DIR}/gradlew.bat")
  set(DEPLOY_COMMAND powershell -ExecutionPolicy Bypass -File "${CMAKE_SOURCE_DIR}/scripts/deploy.ps1")
else()
  set(GRADLEW "${CMAKE_SOURCE_DIR}/gradlew")
  set(DEPLOY_COMMAND bash "${CMAKE_SOURCE_DIR}/scripts/deploy.sh")
endif()

add_custom_target(build_backend
  COMMAND ${GRADLEW} :backend:auth-server:bootJar :backend:api-gateway:bootJar :backend:order-engine:bootJar :backend:portfolio-service:bootJar :backend:broker-service:bootJar
  WORKING_DIRECTORY "${CMAKE_SOURCE_DIR}"
  USES_TERMINAL
)

add_custom_target(deploy
  COMMAND ${DEPLOY_COMMAND}
  WORKING_DIRECTORY "${CMAKE_SOURCE_DIR}"
  USES_TERMINAL
)
