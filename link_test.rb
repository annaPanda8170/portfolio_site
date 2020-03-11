# まず gem install selenium-webdriver してください

require 'selenium-webdriver'
require 'securerandom'
# ここから４行基本設定
options = Selenium::WebDriver::Chrome::Options.new
options.add_argument('--headless') 
d = Selenium::WebDriver.for :chrome, options: options
wait = Selenium::WebDriver::Wait.new(:timeout => 30)

# ポートフォリオサイトに行く
d.get("http://annapanda.xyz/")
# 全てのaタグ回収
a_tags = d.find_elements(:tag_name, "a")
data_set = []
# data_setに配列でURLとdataをセットで格納してゆく
a_tags.each do |a|
  data = []
  data << a.attribute("href")
  data << a.attribute("data")
  data_set << data
end
# 画像出力しなかったもののカウント用
not_output = 0
data_set.each do |data|
  # ツイッター以外は(ログインが必要なため)、dataの値を名前にしてスクショを保存してゆく
  if data[1]!="ツイッター"
    d.get(data[0])
    wait.until {d.find_element(:tag_name, 'div').displayed?}
    d.save_screenshot("/Users/handaryouhei/Desktop/#{data[1]}.png")
    not_output += 1
  end
end
puts "#{data_set.length - not_output}枚の画像を出力"
# 終了
d.quit