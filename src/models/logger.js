import { formatLogMessage } from "~/utils/format-log-message"

const logger = {
  state: {
    entityCount: 0,
    typeCount: {},
    activityTimers: {},
  },

  reducers: {
    incrementActivityTimer(state, { typeName, by }) {
      const logger = state.activityTimers[typeName]

      if (!logger) {
        return state
      }

      if (typeof by === `number`) {
        logger.count += by
        state.entityCount += by
      }

      logger.activity.setStatus(`fetched ${logger.count}`)

      return state
    },

    stopActivityTimer(state, { typeName }) {
      const logger = state.activityTimers[typeName]

      if (logger.count === 0) {
        logger.activity.setStatus(`fetched 0`)
      }

      logger.activity.end()

      return state
    },

    createActivityTimer(state, { typeName, reporter, pluginOptions }) {
      if (state.activityTimers[typeName]) {
        return state
      }

      const typeActivityTimer = {
        count: 0,
        activity: reporter.activityTimer(
          formatLogMessage(typeName, {
            useVerboseStyle: pluginOptions.verbose,
          })
        ),
      }

      if (pluginOptions.verbose) {
        typeActivityTimer.activity.start()
      }

      state.activityTimers[typeName] = typeActivityTimer

      return state
    },
  },
}

export default logger
