Rails.application.config.middleware.use OmniAuth::Builder do
  provider(:identity,
    model: PasswordLogin,
    fields: %i[name email nickname first_name last_name location url phone],
    :on_login => lambda { |e|
      AuthenticationsController.action(:start).call(e)
    },
    :on_registration => lambda { |e|
      AuthenticationsController.action(:registration).call(e)
    },
    :on_failed_registration => lambda { |e|
      AuthenticationsController.action(:failed_registration).call(e)
    },
  )
end
