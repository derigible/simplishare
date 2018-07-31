# Items: Allow the client to request a custom number of items per page with a ready to use selector UI
# See https://ddnexus.github.io/pagy/extras/items
# require 'pagy/extras/items'
Pagy::VARS[:max_items] = 200
Pagy::VARS[:items] = 50
Pagy::VARS[:max_per_page] = 200
