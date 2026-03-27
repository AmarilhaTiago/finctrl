-- Seed default categories for new users (triggered on profile creation)
CREATE OR REPLACE FUNCTION seed_user_categories()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO categories (user_id, name, icon, color, type, sort_order) VALUES
    (NEW.id, 'Moradia', 'home', '#5B8AF5', 'expense', 1),
    (NEW.id, 'Alimentação', 'utensils', '#22D3A0', 'expense', 2),
    (NEW.id, 'Transporte', 'car', '#F5A623', 'expense', 3),
    (NEW.id, 'Lazer', 'gamepad-2', '#A78BFA', 'expense', 4),
    (NEW.id, 'Saúde', 'heart-pulse', '#EF5350', 'expense', 5),
    (NEW.id, 'Educação', 'graduation-cap', '#38BDF8', 'expense', 6),
    (NEW.id, 'Vestuário', 'shirt', '#FB7185', 'expense', 7),
    (NEW.id, 'Assinaturas', 'repeat', '#34D399', 'expense', 8),
    (NEW.id, 'Viagem', 'plane', '#FBBF24', 'expense', 9),
    (NEW.id, 'Outros', 'circle-dot', '#94A3B8', 'both', 10),
    (NEW.id, 'Salário', 'banknote', '#22D3A0', 'income', 11),
    (NEW.id, 'Freelance', 'laptop', '#5B8AF5', 'income', 12),
    (NEW.id, 'Investimentos', 'trending-up', '#A78BFA', 'income', 13),
    (NEW.id, 'Outras Receitas', 'plus-circle', '#94A3B8', 'income', 14);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION seed_user_categories();
