ThisBuild / scalaVersion := "3.4.2"
ThisBuild / version := "0.1.0-SNAPSHOT"
ThisBuild / organization := "dev.maizy"

val zioVersion = "2.1.6"
val zioHttpVersion = "3.0.0-RC9"
val zioLoggingVersion = "2.3.0"
val zioConfigVersion = "4.0.2"

lazy val server = (project in file("server"))
  .settings(
    name := "wlb-backend",
    libraryDependencies ++= Seq(
      "dev.zio" %% "zio" % zioVersion,
      "dev.zio" %% "zio-logging" % zioLoggingVersion,
      "dev.zio" %% "zio-http" % zioHttpVersion,
      "dev.zio" %% "zio-config" % zioConfigVersion,
      "dev.zio" %% "zio-config-typesafe" % zioConfigVersion,
      "dev.zio" %% "zio-config-magnolia" % zioConfigVersion,

      "dev.zio" %% "zio-test" % zioVersion % Test,
    ),
    testFrameworks += new TestFramework("zio.test.sbt.ZTestFramework"),

    dockerExposedPorts := Seq(53404),
    dockerBaseImage := "public.ecr.aws/amazoncorretto/amazoncorretto:21-al2023-headless",
    dockerRepository := Some("ghcr.io"),
    dockerUsername := Some("maizy"),
    Docker / daemonUserUid := None,
    Docker / daemonUser := "daemon"
  )
  .enablePlugins(JavaAppPackaging)
  .enablePlugins(DockerPlugin)
