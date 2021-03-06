# frozen_string_literal: true

module Preferences
  PREFERENCE_HASH = {
    email: {
      todo: %i[update archive],
      note: %i[update archive]
    }
  }.with_indifferent_access.freeze

  def skip_notification?(preference, record_type, action)
    ve_pref = preferences[preference][record_type.downcase][action]
    user_pref = user.preferences[preference][record_type.downcase][action]
    check_skip(ve_pref, user_pref)
  end

  def update_preference(preference_type:, record_type:, action:, preference:)
    if valid_preference?(preference_type, record_type, action)
      update_preference_hash(preference_type, record_type, action, preference)
    else
      errors.add(:preferences, "#{preference_type} -> #{record_type} -> #{action} not valid.")
      raise ActiveRecord::RecordInvalid, self
    end
  end

  # will move to private once all models have been updated correctly
  def prepopulate_preference_hash
    self.preferences = PREFERENCE_HASH.keys.each_with_object({}) do |preference_type, memo|
      memo[preference_type] = user_record? ? populate_user_preference(preference_type) : populate_type(preference_type)
    end
  end

  private

  def update_preference_hash(preference_type, record_type, action, preference)
    preferences[preference_type] = preferences.fetch(preference_type, {}).merge!(
      record_type => (preferences.dig(preference_type, record_type) || {}).merge!(
        action => preference
      )
    )
    save!
  end

  def populate_user_preference(preference_type)
    PREFERENCE_HASH[preference_type].keys.each_with_object({}) do |record_type, memo|
      memo[record_type] = PREFERENCE_HASH[preference_type][record_type].each_with_object({}) do |action, action_memo|
        action_memo[action] = 'always'
      end
    end
  end

  def populate_type(preference_type)
    type = entity.type.downcase
    PREFERENCE_HASH[preference_type][type].each_with_object(type => {}) do |action, memo|
      memo[type][action] = 'not_set'
    end
  end

  def user_record?
    self.class.name == 'User'
  end

  def valid_preference?(preference_type, record_type, action)
    PREFERENCE_HASH.dig(preference_type, record_type)&.include?(action.to_sym) &&
      (user_record? || record_type.to_s.capitalize == entity.type)
  end

  def check_skip(ve_pref, user_pref)
    return false if ve_pref == 'always'
    return true if ve_pref == 'never'
    user_pref == 'never'
  end
end
