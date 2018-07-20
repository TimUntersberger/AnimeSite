module HorribleSubs
  module Api
    module JsonSerializable
      def to_json(*args)
        hash = {}
        self.instance_variables.each do |v|
          hash[v.to_s.sub("@", "")] = instance_variable_get(v)
        end
        return hash.to_json
      end
    end
  end
end