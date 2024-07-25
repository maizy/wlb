package dev.maizy.wlb.backend.server

import zio.config.typesafe.TypesafeConfigProvider
import zio.http.{Method, Response, Root, Routes, Server, handler}
import zio.{Config, Runtime, Scope, Task, ZIO, ZIOAppArgs, ZIOAppDefault, ZLayer}
import dev.maizy.wlb.backend.server.config.HttpApiConfig

object ServerApp extends ZIOAppDefault {

  override val bootstrap: ZLayer[ZIOAppArgs, Any, Any] =
    Runtime.setConfigProvider(TypesafeConfigProvider.fromResourcePath())

  private val routes: Routes[Any, Nothing] =
    Routes(
      Method.GET / Root -> handler(Response.text("beep"))
    )

  private val serverConfig: ZLayer[Any, Config.Error, Server.Config] =
    ZLayer.fromZIO(
      ZIO.config(HttpApiConfig.config).map { c =>
        Server.Config.default.binding(c.host, c.port)
      }
    )

  private def apiServer: Task[Nothing] =
    Server
      .serve(routes)
      .provide(
        serverConfig,
        Server.live
      )

  override def run: ZIO[Environment & ZIOAppArgs & Scope, Any, Any] =
    for {
      _ <- ZIO.logInfo("WLB backend server is starting")
      _ <- apiServer
    } yield ()

}
