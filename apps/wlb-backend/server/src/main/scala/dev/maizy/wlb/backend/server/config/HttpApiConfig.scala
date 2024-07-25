package dev.maizy.wlb.backend.server.config

import zio.Config
import zio.config.magnolia.deriveConfig

final case class HttpApiConfig(host: String, port: Int)

object HttpApiConfig {
  val config: Config[HttpApiConfig] = deriveConfig[HttpApiConfig].nested("wlb", "HttpApiConfig")
}
