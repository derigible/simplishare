module Preferences
  PREFERENCE_HASH = {
    email: {
      todo: %i[update create delete share link],
      note: %i[update create delete share link]
    }
  }.with_indifferent_access.freeze

  def update_preference(preference_type:, record_type:, action:, preference:)
    if valid_preference?(preference_type, record_type, action)
      preferences[preference_type] = preferences.fetch(preference_type, {}).merge!(
        record_type => (preferences.dig(preference_type, record_type) || {}).merge!(
          action => preference
        )
      )
    else
      errors.add(:preferences, "#{preference_type} -> #{record_type} -> #{action} not valid.")
      raise ActiveRecord::RecordInvalid, self
    end
  end

  private

  def valid_preference?(preference_type, record_type, action)
    PREFERENCE_HASH.dig(preference_type, record_type)&.include?(action) &&
      (self.class.name == 'User' || record_type.to_s.capitalize == entity.type)
  end
end
