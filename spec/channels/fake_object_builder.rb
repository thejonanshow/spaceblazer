module FakeObjectBuilder
  def build_fake(target, klass)
    fake_klass = klass.dup
    Kernel.const_set("Fake#{klass.to_s}", fake_klass)

    Proc.new do
      fake_klass.class_eval do
        instance_methods.each do |m|
          self.undef_method(m) unless ((m.match(/^__/)) || (m.match(/^#{target}/)))
        end
      end
    end

    fake_klass.class_eval { def initialize; end }
    fake_klass.new
  end

  def action_signature(action, data)
    "#{self.class.name}##{action}".dup.tap do |signature|
      if (arguments = data.except("action")).any?
        signature << "(#{arguments.inspect})"
      end
    end
  end
end
